const mqtt = require('mqtt');
const Cleanup = require('./cleanup');

const { MQTT_HOST = 'localhost' } = process.env;

const client = mqtt.connect(`mqtt://${MQTT_HOST}`, { clientId: 'garage-door-switch'});

const log = require('./logger')(module);

let state = 'closed';

const isPi = require('detect-rpi');

let garageButton = {
  readSync: () => log('readSync()'),
  writeSync: (value) => log(`writeSync() ${value}`),
  write: (value, cb) => { log(`writeSync() ${value}`); cb(null, value); }
};

if (isPi()) {
  log('Raspberry Pi detected... using real gpio');
  const Gpio = require('onoff').Gpio;
  garageButton = new Gpio(4, 'out');
} else {
  log('Using mock gpio');
}

const levels = {
  HIGH: 1,
  LOW: 0,
};

// start it high (relay deactivated...)
log('Starting GPIO pin on hi');
garageButton.writeSync(levels.HIGH);

garageButton.depress = () => {
  garageButton.writeSync(levels.LOW);
  setTimeout(() => {
    garageButton.write(levels.HIGH, (err, value) => {
      const message = err ? err.message : `garage button state set to ${value}`;
      log(message);
    });
  }, 500);
};

const topicHandlers = {
  'garage/open': (message) => {
    if (state !== 'open' && state !== 'opening') {
      log('opening garage door');
      state = 'opening';
      sendStateUpdate();

      garageButton.depress();

      // simulate door open after 5 seconds (would be listening to hardware)
      setTimeout(() => {
        state = 'open';
        sendStateUpdate();
      }, 5000)
    }
  },
  'garage/close': (message) => {
    state = 'closed';
    sendStateUpdate();
    log(`close: ${message}`);
  }
};

client.on('connect', () => {
  Object.keys(topicHandlers).forEach(topic => client.subscribe(topic));

  client.publish('garage/connected', 'true');
  sendStateUpdate();
});

client.on('message', (topic, message) => {
  const noOp = () => {};
  const handler = topicHandlers[topic] || noOp;

  handler(message);
});

// added to end of garage.js
const sendStateUpdate = () => {
  log(`sending state ${state}`);
  client.publish('garage/state', state)
};

Cleanup(() => {
  return new Promise((res, rej) => {
    client.publish('garage/connected', 'false');
    log('closing mqtt connection');
    const force = false;
    client.end(force, res);
  });
});
