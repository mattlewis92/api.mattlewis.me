var Xray = require('x-ray');

var PROFILE_URL = 'https://www.linkedin.com/in/mattlewis92';

module.exports = function(req, res, next) {

  var x = Xray();

  x(PROFILE_URL, {
    name: '#name-container .full-name',
    picture: '.profile-picture img@src',
    connections: '.member-connections strong',
    location: '#location .locality',
    industry: '#location .industry',
    summary: '#summary-item .description',
    skills: ['.skill-pill a'],
    jobs: x('#background-experience .section-item', [{
      company: {
        name: 'header a[dir=auto]',
        logo: 'header .experience-logo img@src'
      },
      position: 'header h4 a',
      duration: '.experience-date-locale',
      location: '.experience-date-locale .locality',
      description: '.description'
    }]),
    education: x('#background-education .section-item', [{
      name: 'header h4.org',
      logo: '.education-logo img@src',
      degree: '.degree',
      subject: '.major',
      grade: '.grade',
      duration: '.education-date'
    }])
  })(function(err, result) {
    if (err) {
      return next(err);
    }
    result.jobs = result.jobs.map(function(job) {
      job.duration = job.duration.replace(job.location, '');
      return job;
    });
    result.education = result.education.map(function(item) {
      if (item.degree) {
        item.degree = item.degree.replace(', ', '');
      }
      if (item.grade) {
        item.grade = item.grade.replace(', ', '');
      }
      return item;
    });
    res.json(result);
  });

};