const mqtt = require('mqtt');

const Cleanup = require('./cleanup');
const log = require('./logger')(module);

const GpioFactory = require('./GpioFactory');
const Gpio = GpioFactory.create();

const garageButton = new Gpio(4, 'high');
const magneticSensor = new Gpio(18, 'in', 'both');

const MQTT_AVAILABILITY_TOPIC = 'garage/connected';
const MQTT_GARAGE_STATE_TOPIC = 'garage/state';
const MQTT_COMMAND_TOPIC = 'garage/press';

garageButton.depress = () => {
  garageButton.writeSync(Gpio.LOW);
  setTimeout(() => {
    garageButton.writeSync(Gpio.HIGH);
  }, 500);
};

const {
  MQTT_HOST = 'localhost',
  MQTT_CLIENT_ID = '',
} = process.env;

const will = {
  topic: MQTT_AVAILABILITY_TOPIC,
  payload: 'offline',
  qos: 0,
  retain: true,
};

const mqttClient = mqtt.connect(`mqtt://${MQTT_HOST}`, { clientId: MQTT_CLIENT_ID, will });

const doorValue = magneticSensor.readSync();
log('Initial magnetic sensor state', { doorValue });

const STATES = {
  OPEN: 'open',
  OPENING: 'opening',
  CLOSED: 'closed',
  CLOSING: 'closing',
};

const determineDoorPosition = (pinValue) => pinValue === Gpio.HIGH ? STATES.CLOSED : STATES.OPEN;

let state = determineDoorPosition(doorValue);

const nextStates = {
  [STATES.CLOSED]: STATES.OPENING,
  [STATES.OPENING]: STATES.OPEN,
  [STATES.OPEN]: STATES.CLOSING,
  [STATES.CLOSING]: STATES.CLOSED,
};

magneticSensor.watch((err, edge) => {
  if (err) {
    log(err.message);
    throw err;
  }

  log('Magnetic switch changed', { edge });

  magneticSensor.read((err, value) => {
    log('magnetic switch value', { value });
    state = determineDoorPosition(value);
    sendStateUpdate();
  });
});

const topicHandlers = {
  [MQTT_COMMAND_TOPIC]: (message) => {
    if ([STATES.OPENING, STATES.CLOSING].includes(state)) {
      return sendStateUpdate();
    }

    const command = message.toString();

    log('Received command', { command });

    if (command.toLowerCase() === 'close' && state === STATES.CLOSED
      || command.toLowerCase() === 'open' && state === STATES.OPEN) {
      return sendStateUpdate();
    }

    state = nextStates[state];

    sendStateUpdate();
    garageButton.depress();
  },
  'garage/open': (message) => {
    if ([STATES.OPEN, STATES.OPENING].includes(state)) {
      return sendStateUpdate();
    }

    log('opening garage door');
    state = STATES.OPENING;
    sendStateUpdate();

    garageButton.depress();
  },
  'garage/close': (message) => {
    if ([STATES.CLOSED, STATES.CLOSING].includes(state)) {
      return sendStateUpdate();
    }

    log('closing garage door');
    state = STATES.CLOSING;
    sendStateUpdate();

    garageButton.depress();
  },
  'garage/ping': (message) => {
    log('received PING');
    sendConnectionUpdate();
    sendStateUpdate();
  },
};

const debugEventLogger = (event, mqttClient) =>
  mqttClient.on(
    event,
    (...args) => log('DEBUG: Event emitted', { event, arguments: args })
  );

const shouldDebugLog = ['1', 'true'].includes(process.env.DEBUG_LOG);

if (shouldDebugLog) {
  const loggedEvents = ['offline', 'status', 'error', 'message', 'connect'];

  loggedEvents.forEach(e => debugEventLogger(e, mqttClient));
}

mqttClient.on('connect', () => {
  Object.keys(topicHandlers).forEach(topic => mqttClient.subscribe(topic));

  sendConnectionUpdate();
  sendStateUpdate();
});

mqttClient.on('offline', () => {
  const { protocol, host, keepalive, clientId } = mqttClient.options;
  log('Going offline', { protocol, host, keepalive, clientId });
});

mqttClient.on('message', (topic, message) => {
  const noOp = () => {};
  const handler = topicHandlers[topic] || noOp;

  handler(message);
});

const sendConnectionUpdate = () => {
  mqttClient.publish(MQTT_AVAILABILITY_TOPIC, 'online', { qos: 0, retain: true });
};

// added to end of garage.js
const sendStateUpdate = () => {
  log('sending state', state);
  mqttClient.publish(MQTT_GARAGE_STATE_TOPIC, state)
};

Cleanup(() => new Promise((res, rej) => {
  mqttClient.publish(MQTT_AVAILABILITY_TOPIC, 'offline', { qos: 0, retain: true });
  log('closing mqtt connection');
  const force = false;
  mqttClient.end(force, res);
}));
