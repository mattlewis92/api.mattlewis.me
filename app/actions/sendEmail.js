var nodemailer = require('nodemailer');

module.exports = function(req, res, next) {

  var transporter = nodemailer.createTransport({
    host: 'smtp.mandrillapp.com',
    port: 587,
    auth: {
      user: process.env.MANDRILL_USER,
      pass: process.env.MANDRILL_PASSWORD
    }
  });

  transporter.sendMail({
    from: req.body.name + ' <' + process.env.MANDRILL_USER + '>',
    to: process.env.MANDRILL_USER,
    subject: 'New message from ' + req.body.name + ' via the website contact form',
    text: req.body.message,
    replyTo: req.body.email
  }, function(err) {
    if (err) {
      return next(err);
    }
    res.json({success: true});
  });

};