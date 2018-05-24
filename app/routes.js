const route = require('koa-route');
const compose = require('koa-compose');
const rateLimit = require('koa-ratelimit-lru');
const defaultAction = require('./actions/default');
const tweetsAction = require('./actions/social/getTweets');
const githubReposAction = require('./actions/social/githubRepos');
const sendEmailAction = require('./actions/contact/sendEmail');

const cacheCheck = expiry => {
  return async(ctx, next) => {
    if (!await ctx.cashed(expiry)) {
      await next();
    }
  };
};

const limitMiddleware = compose([async(ctx, next) => {
  await next();
  if (ctx.body.msg) {
    ctx.body = {message: ctx.body.msg}; // the frontend expects `message` instead of `msg`
  }
}, rateLimit({
  duration: 1000 * 60 * 10,
  errorMessage: 'Sorry but you can\'t send that many emails',
  rate: 5
})]);

const routes = [
  route.get('/', compose([defaultAction])),
  route.get('/social/tweets', compose([cacheCheck(), tweetsAction])),
  route.get('/social/github/repos', compose([cacheCheck(), githubReposAction])),
  route.post('/contact', compose([limitMiddleware, sendEmailAction]))
];

module.exports = compose(routes);