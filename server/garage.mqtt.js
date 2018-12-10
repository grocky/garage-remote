const mqtt = require('mqtt');
const Cleanup = require('./cleanup');

const { MQTT_HOST = 'localhost' } = process.env;

const client = mqtt.connect(`mqtt://${MQTT_HOST}`, { clientId: 'garage-door-switch'});

const log = require('./logger');

let state = 'closed';

const topicHandlers = {
  'garage/open': (message) => log(`open: ${message}`),
  'garage/close': (message) => log(`close: ${message}`),
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
