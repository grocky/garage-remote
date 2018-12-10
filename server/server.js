const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mqttController = require('./middleware/controller.mqtt');

const log = require('./logger');

const app = express();

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, '..', 'client', 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

const buildDirectory = path.join(__dirname, '..', 'client', 'build');

console.log(`Using build directory: ${buildDirectory}`);

app.use(express.static(buildDirectory));

const mqttState = {
  garageState: '',
  connected: false,
};

const mqttTopicHandlers = {
  'garage/connected': (message) => {
    log(`garage/connected - ${message}`);
    mqttState.connected = message.toString() === 'true';
  },
  'garage/state': (message) => {
    mqttState.garageState = message;
    log(`garage state updated to ${message}`);
  }
};

mqttController.clientInitializer({
  host: process.env.MQTT_HOST || 'localhost',
  clientId: 'controller',
  topicHandlers: mqttTopicHandlers,
});

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
