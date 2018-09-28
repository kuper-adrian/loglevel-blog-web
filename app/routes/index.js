const express = require('express');
const loglevelApi = require('../services/api');
const logger = require('../services/logger').getLogger();

const router = express.Router();
const ApiClient = loglevelApi.Client;

/* GET home page. */
router
  .get('/', (req, res, next) => {
    const page = !req.query.page ? 0 : Number(req.query.page);

    ApiClient.getPostsByPage(req, res, page)
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
    // if get parameters for the snackbar were passed
    if (req.query.sbType && req.query.sbText) {
      // render page with snackbar
      res.render(
        'index',
        {
          title: 'loglevel: blog',
          data: req.devNullPosts,
          snackbarMessage: { type: req.query.sbType, text: req.query.sbText },
        },
      );
    } else {
      res.render('index', { title: 'loglevel: blog', data: req.devNullPosts });
    }
  });

module.exports = router;
