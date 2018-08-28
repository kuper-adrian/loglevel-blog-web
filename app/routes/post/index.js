const express = require('express');
const { Base64 } = require('js-base64');
const asciidoctor = require('asciidoctor.js')();

const logger = require('../../services/logger').getLogger();
const loglevelApi = require('../../services/api');

const router = express.Router();
const Api = loglevelApi.Client;

const createRouter = require('./create');

router.use('/create', createRouter);

router.get('/', (req, res, next) => {
  const page = !req.query.page ? 0 : Number(req.query.page);
  Api.getPostsByPage(page, req.cookies)
    .then((result) => {
      res.render('index', { title: 'dev-null-blog', data: result.data });
    })
    .catch((error) => {
      // TODO proper error handling
      logger.error(error);
      next(error);
    });
});

/* GET page to view specific blog post. */
router.get('/:id', (req, res, next) => {
  Api.getPostById(req.params.id)
    .then((result) => {
      const { data: displayablePost } = result;
      const asciidoc = Base64.decode(displayablePost.text);
      displayablePost.text = asciidoctor.convert(asciidoc);
      req.devNullPost = displayablePost;
      next();
    })

    .catch((error) => {
      // TODO proper error handling
      logger.error(error);
      next(error);
    });
}, (req, res) => {
  res.render('post/index', { title: req.devNullPost.title, data: req.devNullPost });
});

module.exports = router;
