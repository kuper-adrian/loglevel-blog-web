const express = require('express');
const router = express.Router();


/* GET page to view specific blog post. */
router.get('/', (req, res,) => {
  res.render('post/create', { title: 'create' }) 
})

module.exports = router;
