const express = require('express');
const router = express.Router();
const Gpio = require('onoff').Gpio;

const log = (msg) => console.log(`${new Date()} - ${msg}`);

const isPi = require('detect-rpi');

let garageButton = {
  readSync: () => log('readSync()'),
  writeSync: (value) => log('writeSync()', value),
  write: (value, cb) => { log('writeSync()', value); cb(null, value); }
};

if (isPi()) {
  log('Raspberry Pi detected... using real gpio');
  garageButton = new Gpio(4, 'out');
} else {
  log('Using mock gpio');
}

// start it high (relay deactivated...)
garageButton.writeSync(Gpio.HIGH);

router.get('/', function(req, res, next) {
  let message = '';

  if (garageButton.readSync() === 0) {
    message = 'garage toggle is already in progress';
    log(message);
    res.json({
      status: '200',
      data: {
        message
      }
    });
  } else {
    garageButton.writeSync(Gpio.LOW);
    setTimeout(() => {
      garageButton.write(Gpio.HIGH, (err, value) => {
        const message = err ? err.message : `garage button state set to ${value}`;
        log(message);
        res.json({ datea: { message }})
      });
    }, 500)
  }
});

module.exports = router;
