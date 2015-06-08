var request = require('request');
var bluebird = require('bluebird');
var cache = require('memory-cache');
bluebird.promisifyAll(request);
const GITHUB_USERNAME = 'mattlewis92';

module.exports = function *() {

  if (cache.get(this.request.url)) {
    return this.body = cache.get(this.request.url);
  }

  var url = 'https://api.github.com/users/' + GITHUB_USERNAME + '/events/public';

  var result = yield request.getAsync({url: url, json: true, headers: {'User-Agent': 'mattlewis92'}});

  var response = result[0], body = result[1];

  if (response.statusCode !== 200) {
    throw new Error(body);
  }

  cache.put(this.request.url, body, 5 * 60 * 1000);

  this.body = body;

};