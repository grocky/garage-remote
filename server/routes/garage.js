const express = require('express');
const router = express.Router();

const log = require('../logger');

const isPi = require('detect-rpi');

let garageButton = {
  readSync: () => log('readSync()'),
  writeSync: (value) => log('writeSync()', value),
  write: (value, cb) => { log('writeSync()', value); cb(null, value); }
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
garageButton.writeSync(levels.HIGH);

router.get('/', function(req, res, next) {
  let message = '';

  if (garageButton.readSync() === levels.LOW) {
    message = 'garage toggle is already in progress';
    log(message);
    res.json({
      status: '200',
      data: {
        message
      }
    });
  } else {
    garageButton.writeSync(levels.LOW);
    setTimeout(() => {
      garageButton.write(levels.HIGH, (err, value) => {
        const message = err ? err.message : `garage button state set to ${value}`;
        log(message);
        res.json({ datea: { message }})
      });
    }, 500)
  }
});

module.exports = router;
