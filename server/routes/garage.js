const express = require('express');
const router = express.Router();

const isPi = require('detect-rpi');

let LED = {
  readSync: () => console.log('readSync()'),
  writeSync: (value) => console.log('writeSync()', value),
  write: (value, cb) => { console.log('writeSync()', value); cb(null, value); }
};

if (isPi()) {
  console.log('Raspberry Pi detected... using real gpio')
  const Gpio = require('onoff').Gpio;
  LED = new Gpio(4, 'out');
} else {
  console.log('Using mock gpio')
}

let count = 0;

router.get('/', function(req, res, next) {
  let message = '';

  if (LED.readSync() === 1) { //check the pin state, if the state is 0 (or off)
    message = 'garage toggle is already in progress';
    res.json({
      status: '200',
      data: {
        message
      }
    });
  } else {
    message = 'garage toggle successful'
    LED.writeSync(1);
    setTimeout(() => {
      LED.write(0, (err, value) => {
        const response = err 
          ? {data: {message: err.message }}
          : {data: {message: `garage button state set to ${value}`}}
        res.json(response)
      });
    }, 500)
  }
});

module.exports = router;
