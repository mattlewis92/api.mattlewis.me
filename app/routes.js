var express = require('express');
var router = express.Router();

router.post('/contact', require('./actions/sendEmail'));
router.get('/social/tweets', require('./actions/getTweets'));
router.get('/social/github', require('./actions/githubActivity'));
router.get('/social/linkedin', require('./actions/linkedInProfile'));

module.exports = router;