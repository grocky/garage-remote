const express = require('express');
const router = express.Router();

/* GET users listing. */

let count = 0;

router.get('/', function(req, res, next) {
  const message = ++count % 3 === 0 
    ? 'Oops, something bad happened' 
    : 'garage toggle was successful';
  res.json({
    status: '200',
    data: {
      message
    }});
});

module.exports = router;
