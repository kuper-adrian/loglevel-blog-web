const express = require('express');
const loglevelApi = require('../../services/api');
const { Base64 } = require('js-base64');
const asciidoctor = require('asciidoctor.js')();

const router = express.Router();
const Api = loglevelApi.Client;


/* GET page to view specific blog post. */
router
  .get('/', (req, res, next) => {
    // get tags from api
    Api.getTags(req.cookies)
      .then((result) => {
        res.render('post/create', { title: 'create', data: { tags: result.data } });
      })

      .catch((error) => {
        console.log(error);
        // res.status(500).send();
        next(error);
      });
  })

  .post('/', (req, res, next) => {
    console.log(req.body);
    const { body } = req;

    if (
      !body ||
      !body.title ||
      !body.plug ||
      !body.text ||
      !body.tags
    ) {
      Api.getTags(req.cookies)
        .then((result) => {
          const viewModel = {
            title: 'create',
            data: {
              errorMessage: 'Invalid input',
              tags: result.data,
            },
          };

          res.render('post/create', viewModel);
        })

        .catch((error) => {
          console.log(error);
          // res.status(500).send();
          next(error);
        });
    }

    const blogPost = body;

    // the tags have to "unstringified" and the text must be base64 encoded
    blogPost.tags = JSON.parse(blogPost.tags);
    blogPost.text = Base64.encode(blogPost.text);

    Api.createPost(blogPost, req.cookies)
      .then(() => {

      })

      .catch((error) => {

      });

    res.status(200).redirect('/');
  });

module.exports = router;
