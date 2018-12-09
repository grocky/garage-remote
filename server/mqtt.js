const mqtt = require('mqtt');

const { MQTT_HOST = 'localhost' } = process.env;

const client  = mqtt.connect(`mqtt://${MQTT_HOST}`, { clientId: 'garage-door-switch'});

const log = (msg) => console.log(`${new Date()} - ${msg}`);

client.on('connect', function () {
  client.subscribe('presence', function (err) {
    if (!err) {
      client.publish('presence', 'Hello mqtt');
    }
  })
});

client.on('message', function (topic, message) {
  log(`Message recieved: ${message.toString()}`);
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
