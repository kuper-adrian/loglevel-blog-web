const express = require('express');
const router = express.Router();

const devNullApi = require('../middleware/dev-null-api');
const apiClient = new devNullApi.Client();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('test');
  apiClient.post()
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
});

module.exports = router;
