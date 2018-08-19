const express = require('express');
const loglevelApi = require('../services/api');

const router = express.Router();
const ApiClient = loglevelApi.Client;

/* GET home page. */
router
  .get('/', (req, res, next) => {
    const page = !req.query.page ? 0 : Number(req.query.page);
    console.log('test');
    ApiClient.getPostsByPage(page, req.cookies)
      .then((posts) => {
        req.devNullPosts = posts;
        next();
      })
      .catch((error) => {
        // TODO proper error handling
        console.log(error);
        next(error);
      });
  }, (req, res) => {
    res.render('index', { title: 'dev-null-blog', data: req.devNullPosts });
  })

  .post((req, res) => {
    res.send('test');
  });

module.exports = router;
