const Twit = require('twit');
const bluebird = require('bluebird');

const TWITTER_USER_ID = '2327069694';
bluebird.promisifyAll(Twit.prototype);

module.exports = async ctx => {

  const T = new Twit({
    consumer_key: 'vT3VNBIQ3aLLhNB9goadWUsqY',
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: '2327069694-vz61gQ8NlEB1OUgYcSVuFJpXuEGaZ2UdMSu4dXf',
    access_token_secret: process.env.TWITTER_ACCESS_SECRET
  });

  ctx.body = await T.getAsync('statuses/user_timeline', {
    user_id: TWITTER_USER_ID,
    count: ctx.query.count || 20,
    exclude_replies: true
  });

};