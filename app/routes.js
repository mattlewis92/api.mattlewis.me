var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();

router.use(bodyParser.json());

router.get('/email/validate', require('./actions/validateEmail'));
router.post('/contact', require('./actions/sendEmail'));
router.get('/social/tweets', require('./actions/getTweets'));
router.get('/social/github', require('./actions/githubActivity'));
router.get('/social/linkedin', require('./actions/linkedInProfile'));

router.use(function(req, res) {
  res.status(404).json({message: 'Route not found'});
});

router.use(function(err, req, res, next) {
  res.status(400).json({message: err.message});
});

module.exports = router;