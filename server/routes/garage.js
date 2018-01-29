const express = require('express');
const router = express.Router();

const Gpio = require('onoff').Gpio;
const LED = new Gpio(4, 'out');
const blinkInterval = setInterval(blinkLED, 250); //run the blinkLED function every 250ms

function blinkLED() { 
}

function endBlink() { //function to stop blinking
  clearInterval(blinkInterval); // Stop blink intervals
  LED.writeSync(0); // Turn LED off
  LED.unexport(); // Unexport GPIO to free resources
}

/* GET users listing. */

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
