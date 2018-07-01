const express = require('express');
const router = express.Router();

const devNullApi = require('../middleware/dev-null-api');
const apiClient = new devNullApi.Client();

/* GET page to view specific blog post. */
router.get('/:id', function(req, res, next) {

  // TODO request full post data with id
  res.render('post', { title: 'dev-null-blog', test: req.params.id });
});

module.exports = router;
