const express = require('express');
const loglevelApi = require('../../services/api');

const router = express.Router();
const Api = loglevelApi.Client;


/* GET page to view specific blog post. */
router
  .get('/', (req, res, next) => {
    // get tags from api
    Api.getTags(req.cookies)
      .then((tags) => {
        res.render('post/create', { title: 'create', data: { tags } });
      })

      .catch((error) => {
        console.log(error);
        //res.status(500).send();
        next(error);
      });
  })

  .post('/', (req, res) => {
    console.log(req.body);

    res.status(200).redirect('/');
  });

module.exports = router;
