const nodemailer = require('nodemailer');
const bluebird = require('bluebird');

module.exports = async ctx => {

  const transporter = nodemailer.createTransport({
    host: 'smtp.mailgun.org',
    port: 587,
    auth: {
      user: process.env.MAILGUN_USERNAME,
      pass: process.env.MAILGUN_PASSWORD
    }
  });

  bluebird.promisifyAll(transporter);

  await transporter.sendMailAsync({
    from: `"${ctx.request.body.name}" <${process.env.EMAIL_SEND_TO}>`,
    to: process.env.EMAIL_SEND_TO,
    subject: `New message from ${ctx.request.body.name} via the website contact form`,
    text: ctx.request.body.message,
    replyTo: ctx.request.body.email
  });

  ctx.body = {success: true};

};