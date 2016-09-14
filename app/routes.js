import route from 'koa-route';
import compose from 'koa-compose';
import limit from 'koa-better-ratelimit';
import defaultAction from './actions/default';
import tweetsAction from './actions/social/getTweets';
import githubAction from './actions/social/githubActivity';
import sendEmailAction from './actions/contact/sendEmail';
import slackDerpAction from './actions/slack/derp';
import slackDefineAction from './actions/slack/define';
import zendeskTicketNumberAction from './actions/slack/zendeskTicketNumber';

const cacheCheck = function(expiry) {
  return function* (next) {
    if (yield this.cashed(expiry)) {
      return;
    }
    yield next;
  };
};

const limitMiddleware = limit({
  duration: 1000 * 60 * 10,
  max: 1,
  accessLimited: {
    message: 'Sorry but you can\'t send that many emails'
  }
});

const slackAuth = function(token) {
  return function* (next) {
    if (this.request.body.token !== token) {
      this.status = 401;
      this.body = {message: 'No token provided.'};
      return;
    }
    yield next;
  };
};

const routes = [
  route.get('/', compose([defaultAction])),
  route.get('/social/tweets', compose([cacheCheck(), tweetsAction])),
  route.get('/social/github', compose([cacheCheck(), githubAction])),
  route.post('/contact', compose([limitMiddleware, sendEmailAction])),
  route.post('/slack/derp', compose([slackAuth(process.env.SLACK_DERP_COMMAND_TOKEN), slackDerpAction])),
  route.post('/slack/define', compose([slackAuth(process.env.SLACK_DEFINE_COMMAND_TOKEN), slackDefineAction])),
  route.post('/slack/zendesk-ticket-number', compose([slackAuth(process.env.SLACK_DEFINE_COMMAND_TOKEN), zendeskTicketNumberAction]))
];

export default compose(routes);