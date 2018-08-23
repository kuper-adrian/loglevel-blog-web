/**
 * Wrapper for loglevel-blog-api.
 */

const request = require('request-promise-native');

const PORT = 9002;
const API_HOST_NAME = 'http://localhost';

function getFullUri(subPath) {
  const uri = `${API_HOST_NAME}:${PORT}/v1${subPath}`;
  console.log(`requesting resource at '${uri}'`);
  return uri;
}

class LogLevelBlogApiClient {
  /**
   * Returns blog post by the given id from api.
   * @param {Number} id Id of the request blog post
   */
  static getPostById(id, cookies = { accessToken: '', refreshToken: '' }) {
    if (!id) {
      return Promise.reject(new Error('Invalid "id" parameter passed'));
    }

    return request.get({
      uri: getFullUri(`/post/${id}`),
      json: true,
      headers: {
        Authorization: `Bearer ${cookies.accessToken}`,
      },
    });
  }

  /**
   * Returns paginated blog post previews.
   * @param {Number} page Zero-based page number
   * @param {Object} cookies Object, that contains access and refresh tokens
   */
  static getPostsByPage(page, cookies = { accessToken: '', refreshToken: '' }) {
    if (page === undefined || page === null || page < 0) {
      return Promise.reject(new Error('Invalid "page" parameter passed'));
    }

    return request.get({
      uri: getFullUri(`/post?page=${page}`),
      json: true,
      headers: {
        Authorization: `Bearer ${cookies.accessToken}`,
      },
    });
  }

  static getTags(cookies = { accessToken: '', refreshToken: '' }) {
    return request.get({
      uri: getFullUri('/tag'),
      json: true,
      header: {
        Authorization: `Bearer ${cookies.accessToken}`,
      },
    });
  }

  /**
   * Attempts login for user and returns tokens on success from api.
   * @param {String} username Username of the user
   * @param {String} password Password of the user
   */
  static login(username, password) {
    if (!username) {
      return Promise.reject(new Error('no username'));
    }
    if (!password) {
      return Promise.reject(new Error('no password'));
    }

    return request.post({
      method: 'POST',
      uri: getFullUri('/login'),
      body: {
        username,
        password,
      },
      json: true,
    });
  }
}

exports.Client = LogLevelBlogApiClient;
