var Twit = require('twit');
var bluebird = require('bluebird');
bluebird.promisifyAll(Twit.prototype);
var cache = require('memory-cache');

const TWITTER_USER_ID = '2327069694';

module.exports = function *() {

  if (cache.get(this.request.url)) {
    return this.body = cache.get(this.request.url);
  }

  var T = new Twit({
    consumer_key:         'vT3VNBIQ3aLLhNB9goadWUsqY',
    consumer_secret:      process.env.TWITTER_CONSUMER_SECRET,
    access_token:         '2327069694-vz61gQ8NlEB1OUgYcSVuFJpXuEGaZ2UdMSu4dXf',
    access_token_secret:  process.env.TWITTER_ACCESS_SECRET
  });

  this.body = yield T.getAsync('statuses/user_timeline', {
    user_id: TWITTER_USER_ID,
    count: this.query.count || 20,
    exclude_replies: true
  }).bind(this).spread(function(result) {
    cache.put(this.request.url, result, 5 * 60 * 1000);
    return result;
  });

};