const router = require('koa-router')();

var cacheCheck = function* (next) {
  if (yield* this.cashed()) {
    return;
  }
  yield next;
};

router.post('/contact', require('./actions/sendEmail'));
router.get('/social/tweets', cacheCheck, require('./actions/getTweets'));
router.get('/social/github', cacheCheck, require('./actions/githubActivity'));

module.exports = router;