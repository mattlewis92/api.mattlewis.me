const router = require('koa-router')();

function cacheCheck(expiry) {
  return function* (next) {
    if (yield* this.cashed(expiry)) {
      return;
    }
    yield next;
  }
}

router.get('/', require('./actions/default'));
router.get('/social/tweets', cacheCheck(), require('./actions/getTweets'));
router.get('/social/github', cacheCheck(), require('./actions/githubActivity'));
router.post('/contact', require('./actions/sendEmail'));

module.exports = router;