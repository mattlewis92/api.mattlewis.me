import Twit from 'twit';
import bluebird from 'bluebird';
const TWITTER_USER_ID = '2327069694';
bluebird.promisifyAll(Twit.prototype);

export default async function() {

  const T = new Twit({
    consumer_key: 'vT3VNBIQ3aLLhNB9goadWUsqY',
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: '2327069694-vz61gQ8NlEB1OUgYcSVuFJpXuEGaZ2UdMSu4dXf',
    access_token_secret: process.env.TWITTER_ACCESS_SECRET
  });

  const result = await T.getAsync('statuses/user_timeline', {
    user_id: TWITTER_USER_ID,
    count: this.query.count || 20,
    exclude_replies: true
  });

  this.body = result[0];

}