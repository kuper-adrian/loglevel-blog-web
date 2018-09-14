const express = require('express');

const router = express.Router();

router
  .get('/', (req, res) => {
    res.render('about', { title: 'about - loglevel: blog' });
  });

module.exports = router;
