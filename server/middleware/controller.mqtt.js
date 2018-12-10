const mqtt = require('mqtt');
const Cleanup = require('../cleanup');

const log = (msg) => console.log(`${new Date()} - ${msg}`);

let client;

const clientInitializer = (options) => {
  const { host = 'localhost', clientId, topicHandlers } = options;
  client  = mqtt.connect(`mqtt://${host}`, { clientId });

  client.on('connect', () => {
    Object.keys(topicHandlers).forEach(topic => client.subscribe(topic));
  });

  client.on('message', (topic, message) => {
    const noOp = () => {};
    const handler = topicHandlers[topic] || noOp;

    handler(message);
  });

  Cleanup(() => new Promise((res, rej) => {
    log('closing mqtt connection');
    const force = false;
    client.end(force, res);
  }));
};

const middleware = (req, res, next) => {
  req.app.mqtt = client;
  next();
};

module.exports = {
  clientInitializer,
  middleware,
};
