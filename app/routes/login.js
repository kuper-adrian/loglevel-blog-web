const express = require('express');
const router = express.Router();

const loglevelBlogApi = require('../middleware/dev-null-api');
const apiClient = new loglevelBlogApi.Client();

router
  .get('/', (req, res) => {
    // TODO redirect if already logged in
    res.render('login', { title: 'login' });
  })
  
  .post('/', (req, res) => {
    // check that required form data was passed
    if (!req.body.username) {
      res.render('login', { title: 'invalid', errorMessage: 'Invalid credentials' });
      return;
    }

    if (!req.body.password) {
      res.render('login', { title: 'invalid', errorMessage: 'Invalid credentials' });
      return;
    }

    apiClient.login({
      username: req.body.username,
      password: req.body.password,
    })
      .then((tokens) => {
        res.cookie('accessToken', tokens.accessToken, {
          httpOnly: true,
        });
        res.cookie('refreshToken', tokens.refreshToken, {
          httpOnly: true,
        });
        res.status(200).redirect('/');
      })

      .catch((error) => {
        res.render('login', { title: 'invalid', errorMessage: 'Invalid credentials' });
      });
  });

module.exports = router;