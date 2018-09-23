const express = require('express');
const loglevelApi = require('../services/api');
const logger = require('../services/logger').getLogger();
const url = require('url');

const router = express.Router();
const ApiClient = loglevelApi.Client;

router
  .get('/', (req, res) => {
    // TODO redirect if already logged in
    res.render('login', { title: 'login - loglevel: blog' });
  })

  .post('/', (req, res) => {
    // check that required form data was passed
    if (!req.body.username || !req.body.password) {
      res.render('login', { title: 'login - loglevel: blog', snackbarMessage: { type: 'error', text: 'Invalid credentials' } });
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

        // redirect to index with success snackbar message
        res.status(200).redirect(url.format({
          pathname: '/',
          query: {
            sbType: 'success',
            sbText: 'Login successful!',
          },
        }));
      })

      .catch((error) => {
        logger.error(error.message);
        res.render('login', { title: 'login - loglevel: blog', snackbarMessage: { type: 'error', text: 'Invalid credentials' } });
      });
  });

module.exports = router;
