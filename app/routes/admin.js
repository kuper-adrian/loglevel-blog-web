const express = require('express');
const logger = require('../services/logger').getLogger();

const router = express.Router();

router
  .get('/', (req, res) => {
    res.render('admin', { title: 'admin - loglevel: blog' });
  });

module.exports = router;
