const route = require('koa-route');
const compose = require('koa-compose');
const rateLimit = require('koa-ratelimit-lru');
const defaultAction = require('./actions/default');
const tweetsAction = require('./actions/social/getTweets');
const githubAction = require('./actions/social/githubActivity');
const sendEmailAction = require('./actions/contact/sendEmail');
const slackDerpAction = require('./actions/slack/derp');
const slackDefineAction = require('./actions/slack/define');

const cacheCheck = expiry => {
  return async (ctx, next) => {
    if (!await ctx.cashed(expiry)) {
      await next();
    }
  };
};

const limitMiddleware = compose([async (ctx, next) => {
  await next();
  if (ctx.body.msg) {
    ctx.body = {message: ctx.body.msg}; // the frontend expects `message` instead of `msg`
  }
}, rateLimit({
  duration: 1000 * 60 * 10,
  errorMessage: 'Sorry but you can\'t send that many emails',
  rate: 1
})]);

const slackAuth = token => {
  return async (ctx, next) => {
    if (ctx.request.body.token !== token) {
      ctx.status = 401;
      ctx.body = {message: 'No token provided.'};
    } else {
      await next();
    }
  };
};

const routes = [
  route.get('/', compose([defaultAction])),
  route.get('/social/tweets', compose([cacheCheck(), tweetsAction])),
  route.get('/social/github', compose([cacheCheck(), githubAction])),
  route.post('/contact', compose([limitMiddleware, sendEmailAction])),
  route.post('/slack/derp', compose([slackAuth(process.env.SLACK_DERP_COMMAND_TOKEN), slackDerpAction])),
  route.post('/slack/define', compose([slackAuth(process.env.SLACK_DEFINE_COMMAND_TOKEN), slackDefineAction]))
];

module.exports = compose(routes);