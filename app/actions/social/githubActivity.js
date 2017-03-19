const fetch = require('node-fetch');

const GITHUB_USERNAME = 'mattlewis92';

module.exports = function* () {

  const result = yield fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public`);
  this.body = yield result.json();

}