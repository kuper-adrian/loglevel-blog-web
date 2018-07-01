/**
 * Wrapper for dev-null-api.
 */

const http = require('http');

const API_HOST_NAME = 'localhost';

/**
 * Creates HTTP request options for api call.
 * @param {string} subPath sub url path for api request
 */
function getApiOptions(subPath) {
  return {
    port: '9002',
    path: '/v1/post',
    hostname: API_HOST_NAME,
    method: 'GET',
  };
}

/**
 * Makes api request.
 * @param {Object} options Request options object
 * @param {Function} resolve Callback that is called, when the api request succeeded
 * @param {Function} reject Callback that is called, when an error occures
 */
function apiRequest(options, resolve, reject) {
  http.get(options, (resp) => {
    let data = '';

    // a chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // the whole response has been received.
    resp.on('end', () => {
      const apiData = JSON.parse(data);
      resolve(apiData);
    });
  }).on('error', (err) => {
    reject(err);
  });
}

class DevNullApiClient {
  constructor() {

  }

  post(options) {
    // TODO check and use options properties
    return new Promise((resolve, reject) => {
      const options = getApiOptions('post');
      return apiRequest(options, resolve, reject);
    });
  }
}

exports.Client = DevNullApiClient;