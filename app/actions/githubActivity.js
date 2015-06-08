const request = require('request');
const bluebird = require('bluebird');
const GITHUB_USERNAME = 'mattlewis92';
bluebird.promisifyAll(request);

module.exports = function* () {

  const result = yield request.getAsync({
    url: 'https://api.github.com/users/' + GITHUB_USERNAME + '/events/public',
    json: true,
    headers: {'User-Agent': 'mattlewis92'}
  });

  const response = result[0], body = result[1];

  if (response.statusCode !== 200) {
    throw new Error(body);
  }

  this.body = body;

};