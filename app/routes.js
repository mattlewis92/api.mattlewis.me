const route = require('koa-route');
const compose = require('koa-compose');
const limit = require('koa-better-ratelimit');
const defaultAction = require('./actions/default');
const tweetsAction = require('./actions/social/getTweets');
const githubAction = require('./actions/social/githubActivity');
const sendEmailAction = require('./actions/contact/sendEmail');
const slackDerpAction = require('./actions/slack/derp');
const slackDefineAction = require('./actions/slack/define');
const zendeskTicketNumberAction = require('./actions/slack/zendeskTicketNumber');

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
  route.post('/slack/zendesk-ticket-number', compose([slackAuth(process.env.SLACK_ZENDESK_TICKET_NUMBER_COMMAND_TOKEN), zendeskTicketNumberAction]))
];

module.exports = compose(routes);