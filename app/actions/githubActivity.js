var request = require('request');
var bluebird = require('bluebird');
bluebird.promisifyAll(request);
const GITHUB_USERNAME = 'mattlewis92';
var cache = require('memory-cache');

module.exports = function *() {

  if (cache.get(this.request.url)) {
    return this.body = cache.get(this.request.url);
  }

  var url = 'https://api.github.com/users/' + GITHUB_USERNAME + '/events/public';

  this.body = yield request
    .getAsync({url: url, json: true, headers: {'User-Agent': 'mattlewis92'}})
    .bind(this)
    .spread(function(response, body) {
      if (response.statusCode !== 200) {
        throw new Error(body);
      }
      cache.put(this.request.url, body, 5 * 60 * 1000);
      return body;
    });

};