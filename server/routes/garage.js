const express = require('express');
const router = express.Router();
const log = require('../logger')(module);

router.get('/', function(req, res, next) {
  const { status } = req.app.state;
  if (status === 'closed' || status === 'open') {
    const subTopic = status === 'closed' ? 'open' : 'close';
    const topic = `garage/${subTopic}`;
    log('Publishing action', { topic });
    req.app.mqtt.publish(topic, 'true');
  }
  res.sendStatus(202);
});

module.exports = router;
