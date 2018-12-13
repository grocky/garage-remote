const mqtt = require('mqtt');
const Cleanup = require('../cleanup');

const log = require('../logger')(module);

let client;

/**
 * @typedef {function(message): void} MessageHandler - A handler for a topic's message
 */
/**
 * @typedef {Object<string, MessageHandler>} TopicHandlers - A map of topics to their MessageHandler
 */

/**
 * @param {string} host - the mqtt broker hostname
 * @param {string} clientId - the identifier for this client
 * @param {MessageHandler} topicHandlers
 * @return {MqttClient}
 */
const clientInitializer = ({ host, clientId, topicHandlers }) => {
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

  return client;
};

const middleware = (req, res, next) => {
  req.app.mqtt = client;
  next();
};

module.exports = {
  clientInitializer: clientInitializer,
  middleware: middleware,
};
