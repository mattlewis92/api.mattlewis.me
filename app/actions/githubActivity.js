var request = require('request');
var GITHUB_USERNAME = 'mattlewis92';

module.exports = function(req, res, next) {

  var url = 'https://api.github.com/users/' + GITHUB_USERNAME + '/events/public';
  request({url: url, json: true, headers: {'User-Agent': 'mattlewis92'}}, function(err, response, body) {
    if (err) {
      return next(err);
    } else if (response.statusCode != 200) {
      return next(new Error(body));
    }
    return res.json(body);
  });

};