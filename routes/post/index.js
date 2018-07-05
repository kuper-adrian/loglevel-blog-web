const express = require('express');
const router = express.Router();
const Base64 = require('js-base64').Base64;
var asciidoctor = require('asciidoctor.js')(); // <1>

const devNullApi = require('../../middleware/dev-null-api');
const apiClient = new devNullApi.Client();

const createRouter = require('./create');

router.use('/create', createRouter);

/* GET page to view specific blog post. */
router.get('/:id', (req, res, next) => {

  apiClient.post({ id: req.params.id })
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
})



module.exports = router;
