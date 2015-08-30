import nodemailer from 'nodemailer';
import bluebird from 'bluebird';

export default function *() {

  const transporter = nodemailer.createTransport({
    host: 'smtp.mandrillapp.com',
    port: 587,
    auth: {
      user: process.env.MANDRILL_USER,
      pass: process.env.MANDRILL_PASSWORD
    }
  });

  bluebird.promisifyAll(transporter);

  yield transporter.sendMailAsync({
    from: `${this.request.body.name}<${process.env.MANDRILL_USER}>`,
    to: process.env.MANDRILL_USER,
    subject: `New message from ${this.request.body.name} via the website contact form`,
    text: this.request.body.message,
    replyTo: this.request.body.email
  });

  this.body = {success: true};

};