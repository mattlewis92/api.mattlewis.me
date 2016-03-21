import nodemailer from 'nodemailer';
import bluebird from 'bluebird';

export default function* () {

  const transporter = nodemailer.createTransport({
    host: 'smtp.mailgun.org',
    port: 587,
    auth: {
      user: process.env.MAILGUN_USERNAME,
      pass: process.env.MAILGUN_PASSWORD
    }
  });

  bluebird.promisifyAll(transporter);

  yield transporter.sendMailAsync({
    from: `"${this.request.body.name}" <${process.env.EMAIL_SEND_TO}>`,
    to: process.env.EMAIL_SEND_TO,
    subject: `New message from ${this.request.body.name} via the website contact form`,
    text: this.request.body.message,
    replyTo: this.request.body.email
  });

  this.body = {success: true};

}