const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  req.app.mqtt.publish('garage/open', 'true');
  res.send(202);
});

module.exports = router;
