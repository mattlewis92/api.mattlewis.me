var request = require('request');
var cache = require('memory-cache');
var GITHUB_USERNAME = 'mattlewis92';
var CACHE_TIME = 1000 * 60 * 5; // 5 minutes

module.exports = function(req, res, next) {

  var cachedResult = cache.get('github');
  if (cachedResult) {
    return res.json(cachedResult);
  }

  var url = 'https://api.github.com/users/' + GITHUB_USERNAME + '/events/public';
  request({url: url, json: true, headers: {'User-Agent': 'mattlewis92'}}, function(err, response, body) {
    if (err) {
      return next(err);
    } else if (response.statusCode != 200) {
      return next(new Error(body));
    }
    cache.put('github', body, CACHE_TIME);
    return res.json(body);
  });

};