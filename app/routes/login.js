const express = require('express');
const loglevelApi = require('../services/api');
const logger = require('../services/logger').getLogger();

const router = express.Router();
const ApiClient = loglevelApi.Client;

router
  .get('/', (req, res) => {
    // TODO redirect if already logged in
    res.render('login', { title: 'login' });
  })

  .post('/', (req, res) => {
    // check that required form data was passed
    if (!req.body.username || !req.body.password) {
      res.render('login', { title: 'login', errorMessage: 'Invalid credentials' });
      return;
    }

    ApiClient.login(req.body.username, req.body.password)
      .then((result) => {
        // TODO verify access token!

        res.cookie('accessToken', result.data.accessToken, {
          httpOnly: true,
        });
        res.cookie('refreshToken', result.data.refreshToken, {
          httpOnly: true,
        });
        res.status(200).redirect('/');
      })

      .catch((error) => {
        logger.error(error);
        res.render('login', { title: 'login', errorMessage: 'Invalid credentials' });
      });
  });

module.exports = router;
