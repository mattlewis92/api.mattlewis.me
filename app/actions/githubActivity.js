const request = require('request');
const bluebird = require('bluebird');
const cache = require('memory-cache');
const GITHUB_USERNAME = 'mattlewis92';
bluebird.promisifyAll(request);

module.exports = function *() {

  if (cache.get(this.request.url)) {
    return this.body = cache.get(this.request.url);
  }

  const url = 'https://api.github.com/users/' + GITHUB_USERNAME + '/events/public';

  const result = yield request.getAsync({url: url, json: true, headers: {'User-Agent': 'mattlewis92'}});

  const response = result[0], body = result[1];

  if (response.statusCode !== 200) {
    throw new Error(body);
  }

  cache.put(this.request.url, body, 5 * 60 * 1000);

  this.body = body;

};