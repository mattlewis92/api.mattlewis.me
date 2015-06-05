var express = require('express');
var router = express.Router();
var apicache = require('apicache').options({ debug: process.env.NODE_ENV !== 'production' }).middleware;

router.post('/contact', require('./actions/sendEmail'));
router.get('/social/tweets', apicache('5 minutes'), require('./actions/getTweets'));
router.get('/social/github', apicache('5 minutes'), require('./actions/githubActivity'));
router.get('/social/linkedin', apicache('1 day'), require('./actions/linkedInProfile'));

var request = require('request');
router.get('/test', function(req, res, next) {
  request.get({url: 'https://www.linkedin.com/in/mattlewis92'}, function(err, result) {
    if (err) {
      return next(err);
    }
    res.json(result);
  });
});

module.exports = router;