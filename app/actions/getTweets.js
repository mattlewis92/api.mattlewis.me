var Twit = require('twit');

var TWITTER_USER_ID = '2327069694';

module.exports = function(req, res, next) {

  var T = new Twit({
    consumer_key:         'vT3VNBIQ3aLLhNB9goadWUsqY',
    consumer_secret:      process.env.TWITTER_CONSUMER_SECRET,
    access_token:         '2327069694-vz61gQ8NlEB1OUgYcSVuFJpXuEGaZ2UdMSu4dXf',
    access_token_secret:  process.env.TWITTER_ACCESS_SECRET
  });

  T.get('statuses/user_timeline', {
    user_id: TWITTER_USER_ID,
    count: req.query.count || 20,
    exclude_replies: true
  }, function(err, result) {
    if (err) {
      return next(err);
    }
    res.json(result);
  });

};