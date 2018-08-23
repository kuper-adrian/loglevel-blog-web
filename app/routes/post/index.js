const express = require('express');
const { Base64 } = require('js-base64');
const asciidoctor = require('asciidoctor.js')();

const loglevelApi = require('../../services/api');

const router = express.Router();
const Api = loglevelApi.Client;

const createRouter = require('./create');

router.use('/create', createRouter);

router.get('/', (req, res, next) => {
  const page = !req.query.page ? 0 : Number(req.query.page);
  Api.getPostsByPage(page, req.cookies)
    .then((posts) => {
      res.render('index', { title: 'dev-null-blog', data: posts });
    })
    .catch((error) => {
      // TODO proper error handling
      console.log(error);
      next(error);
    });
});

/* GET page to view specific blog post. */
router.get('/:id', (req, res, next) => {
  Api.getPostById(req.params.id)
    .then((post) => {
      post.text = asciidoctor.convert(Base64.decode(post.text));
      req.devNullPost = post;
      next();
    })

    .catch((error) => {
      // TODO proper error handling
      console.log(error);
      next(error);
    });
}, (req, res) => {
  res.render('post/index', { title: req.devNullPost.title, data: req.devNullPost });
});

module.exports = router;
