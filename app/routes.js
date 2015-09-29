import router from 'koa-router';
import limit from 'koa-better-ratelimit';
import defaultAction from './actions/default';
import tweetsAction from './actions/social/getTweets';
import githubAction from './actions/social/githubActivity';
import sendEmailAction from './actions/contact/sendEmail';
import slackDerpAction from './actions/slack/derp';
import slackDefineAction from './actions/slack/define';

const cacheCheck = function(expiry) {
  return async function (next) {
    if (yield* this.cashed(expiry)) {
      return;
    }
    await next;
  };
};

const limitMiddleware = limit({
  duration: 1000 * 60 * 10,
  max: 1,
  accessLimited: {
    message: `Sorry but you can't send that many emails`
  }
});

const slackAuth = function(token) {
  return async function(next) {
    if (this.request.body.token !== token) {
      this.status = 401;
      this.body = {message: 'No token provided.'};
      return;
    }
    await next;
  };
};


export default router()
  .get('/', defaultAction)
  .get('/social/tweets', cacheCheck(), tweetsAction)
  .get('/social/github', cacheCheck(), githubAction)
  .post('/contact', limitMiddleware, sendEmailAction)
  .post('/slack/derp', slackAuth(process.env.SLACK_DERP_COMMAND_TOKEN), slackDerpAction)
  .post('/slack/define', slackAuth(process.env.SLACK_DEFINE_COMMAND_TOKEN), slackDefineAction);