const loglevelApi = require('../services/api');
const url = require('url');

const ApiClient = loglevelApi.Client;

module.exports = (req, res, next) => {
  ApiClient.hasAccess(req, res)
    .then(() => {
      next();
    })
    .catch((error) => {
      // redirect to index with error snackbar message
      res.status(200).redirect(url.format({
        pathname: '/',
        query: {
          sbType: 'error',
          sbText: error.error.message,
        },
      }));
    });
};
