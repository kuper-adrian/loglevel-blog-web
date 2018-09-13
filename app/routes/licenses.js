const express = require('express');

const router = express.Router();

router
  .get('/', (req, res) => {
    res.render('licenses', { title: 'licenses - loglevel: blog' });
  });
