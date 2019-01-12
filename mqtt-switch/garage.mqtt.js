const mqtt = require('mqtt');

const Cleanup = require('./cleanup');
const log = require('./logger')(module);

const GpioFactory = require('./GpioFactory');
const Gpio = GpioFactory.create();

const garageButton = new Gpio(4, 'high');

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

const mqttClient = mqtt.connect(`mqtt://${MQTT_HOST}`, { clientId: MQTT_CLIENT_ID });

let state = 'closed';

const topicHandlers = {
  'garage/open': (message) => {
    if (state === 'open' || state === 'opening') {
      return sendStateUpdate();
    }

    log('opening garage door');
    state = 'opening';
    sendStateUpdate();

    garageButton.depress();

    // simulate door open after 5 seconds (would be listening to hardware)
    setTimeout(() => {
      log('garage door finished opening');
      state = 'open';
      sendStateUpdate();
    }, 1000 * 11)
  },
  'garage/close': (message) => {
    if (state === 'closed' || state === 'closing') {
      return sendStateUpdate();
    }

    log('closing garage door');
    state = 'closing';
    sendStateUpdate();

    garageButton.depress();

    setTimeout(() => {
      log('garage door finished closing');
      state = 'closed';
      sendStateUpdate();
    }, 1000 * 11);
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
  mqttClient.publish('garage/connected', 'true');
};

// added to end of garage.js
const sendStateUpdate = () => {
  log('sending state', state);
  mqttClient.publish('garage/state', state)
};

Cleanup(() => new Promise((res, rej) => {
    mqttClient.publish('garage/connected', 'false');
    log('closing mqtt connection');
    const force = false;
    mqttClient.end(force, res);
  })
);
