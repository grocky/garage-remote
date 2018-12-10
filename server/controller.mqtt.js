const mqtt = require('mqtt');

const { MQTT_HOST = 'localhost' } = process.env;

const client  = mqtt.connect(`mqtt://${MQTT_HOST}`, { clientId: 'controller'});

const log = (msg) => console.log(`${new Date()} - ${msg}`);

let garageState = '';
let connected = false;

const topicHandlers = {
  'garage/connected': (message) => {
    log(`garage/connected - ${message}`);
    connected = message.toString() === 'true';
  },
  'garage/state': (message) => {
    garageState = message;
    log(`garage state updated to ${message}`);
  }
};

client.on('connect', () => {
  Object.keys(topicHandlers).forEach(topic => client.subscribe(topic));
});

client.on('message', (topic, message) => {
  const noOp = () => {};
  const handler = topicHandlers[topic] || noOp;

  handler(message);
});

const cleanup = (cb) => {
  log('closing mqtt connection');
  const force = false;
  const done = () => {
    log('mqtt connection closed');
    cb();
  };
  client.end(force, done);
};

process.on('cleanup', () => cleanup(() => process.exit()));

process.on('exit', () => log('Done.'));

// catching signals and do something before exit
['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
  'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
].forEach((sig) => {
  process.on(sig, () => {
    log(`signal: ${sig}`);
    process.emit('cleanup');
  });
});

//catch uncaught exceptions, trace, then exit normally
process.on('uncaughtException', (e) => {
  log('Uncaught Exception...');
  log(e.stack);
  process.exit(99);
});
