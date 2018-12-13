const express = require('express');
const router = express.Router();
const log = require('../logger')(module);

router.get('/', function(req, res, next) {
  req.app.mqtt.publish('garage/open', 'true');
  res.send(202);
});

module.exports = router;
