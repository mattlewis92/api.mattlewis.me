const router = require('koa-router')();

router.post('/contact', require('./actions/sendEmail'));
router.get('/social/tweets', require('./actions/getTweets'));
router.get('/social/github', require('./actions/githubActivity'));

module.exports = router;