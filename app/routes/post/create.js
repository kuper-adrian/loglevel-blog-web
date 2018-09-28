const express = require('express');
const { Base64 } = require('js-base64');
const loglevelApi = require('../../services/api');
const logger = require('../../services/logger').getLogger();
const checkAccess = require('../../middleware/checkAccess');

const router = express.Router();
const Api = loglevelApi.Client;


/* GET page to view specific blog post. */
router
  .get('/', checkAccess, (req, res, next) => {
    // get tags from api
    Api.getTags(req, res)
      .then((result) => {
        res.render('post/create', { title: 'create - loglevel: blog', data: { tags: result.data } });
      })

      .catch((error) => {
        logger.error(error);
        // res.status(500).send();
        next(error);
      });
  })

  .post('/', checkAccess, (req, res, next) => {
    const { body } = req;

    if (
      !body ||
      !body.title ||
      !body.plug ||
      !body.text ||
      !body.tags
    ) {
      Api.getTags(req, res)
        .then((result) => {
          const viewModel = {
            title: 'create',
            data: {
              snackbarMessage: {
                type: 'error',
                text: 'Invalid input',
              },
              tags: result.data,
            },
          };

          res.render('post/create', viewModel);
        })

        .catch((error) => {
          logger.error(error);
          // res.status(500).send();
          next(error);
        });
    }

    const blogPost = body;

    // the tags have to "unstringified" and the text must be base64 encoded
    blogPost.tags = JSON.parse(blogPost.tags);
    blogPost.text = Base64.encode(blogPost.text);

    Api.createPost(req, res, blogPost)
      .then((result) => {
        const { blogPostId } = result.data;
        res.status(200).redirect(`/post/${blogPostId}`);
      })

      .catch((error) => {
        logger.error(error);
        res.status(500).redirect('/');
      });
  });

module.exports = router;
