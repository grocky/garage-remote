const express = require('express');
const router = express.Router();
const log = require('../logger')(module);

router.get('/', function(req, res, next) {
  const { status } = req.app.state;
  let subTopic = 'already transitioning';

  if (status === 'closed' || status === 'open') {
    subTopic = status === 'closed' ? 'open' : 'close';
    const topic = `garage/${subTopic}`;
    log('Publishing action', { topic });
    req.app.mqtt.publish(topic, 'true');
  }
  res.status(200).json({ message: subTopic, previousStatus: status })
});

module.exports = router;
