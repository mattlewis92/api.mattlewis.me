var emailExistence = require('email-existence');

module.exports = function(req, res, next) {

  var email = req.query.email;

  emailExistence.check(email, function(err, isValid) {

    if (err) {
      return next(err);
    }

    if (!isValid) {
      return next(new Error('The email provided (' + email + ') is invalid.'));
    }

    res.json({valid: true});

  });

};