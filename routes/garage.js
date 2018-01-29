const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({
    status: '200',
    data: [
      {
        id: 1,
        name: 'Rocky',
        age: 30
      },
      {
        id: 2,
        name: 'Philip',
        age: 6
      },
      {
        id: 3,
        name: 'Darryn',
        age: 2
      }
  ]});
});

module.exports = router;
