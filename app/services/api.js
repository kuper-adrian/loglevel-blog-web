/**
 * Wrapper for loglevel-blog-api.
 */

const request = require("request-promise-native");

const PORT = 9002;
const API_HOST_NAME = 'http://localhost';

function getFullUri(subPath) {
  return `${API_HOST_NAME}:${PORT}/v1${subPath}`;
}

class LogLevelBlogApiClient {
  constructor() {
  }

  post(options) {
    if (!options) {
      return Promise.reject(new Error('invalid parameters'));
    }
      

    if (options.page !== undefined && options.page !== null) {
      return request.get({
        uri: getFullUri(`/post?page=${options.page}`),
        json: true,
        headers: {
          Authorization: `Bearer ${options.cookies.accessToken}`
        }
      });
    }

    if (options.id) {
      return request.get({
        uri: getFullUri(`/post/${options.id}`),
        json: true,
      });
    }

    return Promise.reject(new Error("invalid arguments"));
  }

  login(options) {
    if (!options.username) {
      return Promise.reject(new Error('no username'));
    }
    if (!options.password) {
      return Promise.reject(new Error('no password'));
    }

    return request.post({
      method: 'POST',
      uri: getFullUri('/login'),
      body: {
         username: options.username,
         password: options.password,
      },
      json: true,
    })
  }
}

exports.Client = LogLevelBlogApiClient;