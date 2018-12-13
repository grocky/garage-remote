const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mqttController = require('./middleware/controller.mqtt');
const StateManager = require('./middleware/garage-state');

const log = require('./logger')(module);

const app = express();

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, '..', 'client', 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

const buildDirectory = path.join(__dirname, '..', 'client', 'build');

log(`Using build directory: ${buildDirectory}`);

app.use(express.static(buildDirectory));

const stateManager = new StateManager('garage-state.json');

app.use(StateManager.middleware(stateManager));

const mqttTopicHandlers = {
  'garage/connected': async (message) => {
    log(`garage/connected - ${message}`);
    await stateManager.updateState({ connected: message.toString() === 'true' });
  },
  'garage/state': async (message) => {
    log(`garage state updated to ${message}`);
    await stateManager.updateState({ status: message.toString() });
    await stateManager.storeState();
  }
};

const mqttClient = mqttController.clientInitializer({
  host: process.env.MQTT_HOST || 'localhost',
  clientId: 'controller',
  topicHandlers: mqttTopicHandlers,
});

mqttClient.publish('garage/ping', 'true', log);

app.use(mqttController.middleware);

app.use('/garage', require('./routes/garage'));

app.get('*', (req, res) => {
  res.sendFile(path.join(`${buildDirectory}/index.html`));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
