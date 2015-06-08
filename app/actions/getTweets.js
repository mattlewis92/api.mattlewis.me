const Twit = require('twit');
const cache = require('memory-cache');
const bluebird = require('bluebird');
const TWITTER_USER_ID = '2327069694';

bluebird.promisifyAll(Twit.prototype);

module.exports = function *() {

  if (cache.get(this.request.url)) {
    return this.body = cache.get(this.request.url);
  }

  const T = new Twit({
    consumer_key:         'vT3VNBIQ3aLLhNB9goadWUsqY',
    consumer_secret:      process.env.TWITTER_CONSUMER_SECRET,
    access_token:         '2327069694-vz61gQ8NlEB1OUgYcSVuFJpXuEGaZ2UdMSu4dXf',
    access_token_secret:  process.env.TWITTER_ACCESS_SECRET
  });

  const result = yield T.getAsync('statuses/user_timeline', {
    user_id: TWITTER_USER_ID,
    count: this.query.count || 20,
    exclude_replies: true
  });

  const tweets = result[0];
  cache.put(this.request.url, tweets, 5 * 60 * 1000);
  this.body = tweets;

};