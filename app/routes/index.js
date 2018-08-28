const express = require('express');
const loglevelApi = require('../services/api');
const logger = require('../services/logger').getLogger();

const router = express.Router();
const ApiClient = loglevelApi.Client;

/* GET home page. */
router
  .get('/', (req, res, next) => {
    const page = !req.query.page ? 0 : Number(req.query.page);

    ApiClient.getPostsByPage(page, req.cookies)
      .then((result) => {
        req.devNullPosts = result.data;
        next();
      })
      .catch((error) => {
        // TODO proper eror handling
        logger.error(error);
        next(error);
      });
  }, (req, res) => {
    res.render('index', { title: 'loglevel: blog', data: req.devNullPosts });
  });

module.exports = router;
