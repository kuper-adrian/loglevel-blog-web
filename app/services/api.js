/**
 * Wrapper for loglevel-blog-api.
 */

const request = require('request-promise-native');
const { Base64 } = require('js-base64');
const logger = require('./logger').getLogger();


const PORT = 9002;
const API_HOST_NAME = 'http://localhost';

function getFullUri(subPath) {
  const uri = `${API_HOST_NAME}:${PORT}/v1${subPath}`;
  logger.debug(`requesting resource at '${uri}'`);
  return uri;
}

function getNameFromTokenPayload(accessToken) {
  const payload = JSON.parse(Base64.decode(accessToken.split('.')[1]));
  return payload.name;
}

/**
 * Class to interact with backend REST api.
 */
class LogLevelBlogApiClient {
  /**
   * Returns blog post by the given id from api.
   * @param {Number} id Id of the request blog post
   */
  static getPostById(req, res, id) {
    if (!id) {
      return Promise.reject(new Error('Invalid "id" parameter passed'));
    }

    return request.get({
      uri: getFullUri(`/post/${id}`),
      json: true,
      headers: {
        Authorization: `Bearer ${req.cookies.accessToken}`,
      },
    })
      .catch((error) => {
        if (error.statusCode === 401) {
          return this.refresh(req, res).then(() => this.getPostById(req, res, id));
        }
        return Promise.reject(error);
      });
  }

  /**
   * Returns paginated blog post previews.
   * @param {Number} page Zero-based page number
   * @param {Object} cookies Object, that contains access and refresh tokens
   */
  static getPostsByPage(req, res, page) {
    if (page === undefined || page === null || page < 0) {
      return Promise.reject(new Error('Invalid "page" parameter passed'));
    }

    return request.get({
      uri: getFullUri(`/post?page=${page}`),
      json: true,
      headers: {
        Authorization: `Bearer ${req.cookies.accessToken}`,
      },
    })
      .catch((error) => {
        if (error.statusCode === 401) {
          return this.refresh(req, res).then(() => this.getPostsByPage(req, res, page));
        }
        return Promise.reject(error);
      });
  }

  static getTags(req, res) {
    return request.get({
      uri: getFullUri('/tag'),
      json: true,
      header: {
        Authorization: `Bearer ${req.cookies.accessToken}`,
      },
    })
      .catch((error) => {
        if (error.statusCode === 401) {
          return this.refresh(req, res).then(() => this.getTags(req, res));
        }
        return Promise.reject(error);
      });
  }

  /**
   * Attempts login for user and returns tokens on success from api.
   * @param {String} username Username of the user
   * @param {String} password Password of the user
   */
  static login(res, username, password) {
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
    })
      .then((result) => {
        res.cookie('accessToken', result.data.accessToken, {
          httpOnly: true,
        });
        res.cookie('refreshToken', result.data.refreshToken, {
          httpOnly: true,
        });
      });
  }

  static refresh(req, res) {
    if (!req) {
      return Promise.reject(new Error('no req parameter'));
    }
    if (!res) {
      return Promise.reject(new Error('no res parameter'));
    }

    return request.post({
      method: 'POST',
      uri: getFullUri('/refresh'),
      body: {
        name: getNameFromTokenPayload(req.cookies.accessToken),
        refreshToken: req.cookies.refreshToken,
      },
      json: true,
    })
      .then((result) => {
        // TODO verify access token with public api certificate to verify its authenticity!

        res.cookie('accessToken', result.data.accessToken, {
          httpOnly: true,
        });
        res.cookie('refreshToken', result.data.refreshToken, {
          httpOnly: true,
        });
      });
  }

  static createPost(req, res, blogPost) {
    return request.post({
      uri: getFullUri('/post'),
      body: blogPost,
      json: true,
      headers: {
        Authorization: `Bearer ${req.cookies.accessToken}`,
      },
    })

      .catch((error) => {
        if (error.statusCode === 401) {
          return this.refresh(req, res).then(() => this.createPost(req, res, blogPost));
        }
        return Promise.reject(error);
      });
  }

  static hasAccess(req, res) {
    return request.get({
      uri: getFullUri('/hasAccess'),
      json: true,
      headers: {
        Authorization: `Bearer ${req.cookies.accessToken}`,
      },
    })
      .catch((error) => {
        if (error.statusCode === 401) {
          return this.refresh(req, res).then(() => this.hasAccess(req, res));
        }
        return Promise.reject(error);
      });
  }
}

exports.Client = LogLevelBlogApiClient;
