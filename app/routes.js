var express = require('express');
var router = express.Router();
var apicache = require('apicache').options({ debug: process.env.NODE_ENV !== 'production' }).middleware;

router.post('/contact', require('./actions/sendEmail'));
router.get('/social/tweets', apicache('5 minutes'), require('./actions/getTweets'));
router.get('/social/github', apicache('5 minutes'), require('./actions/githubActivity'));
//router.get('/social/linkedin', apicache('1 day'), require('./actions/linkedInProfile')); //disabled as blocked on heroku

module.exports = router;