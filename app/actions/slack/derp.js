import Slack from 'node-slack';
import fetch from 'node-fetch';
const slack = new Slack(process.env.SLACK_WEBHOOK);
const IMGUR_CLIENT_ID = 'de44c1f57f60e41';

export default async function() {

  const result = await fetch('https://api.imgur.com/3/gallery/r/derp/0', {
    headers: {
      Authorization: 'Client-ID ' + IMGUR_CLIENT_ID
    }
  });

  const images = await result.json();

  var item = images.data[Math.floor(Math.random() * images.data.length)];

  await slack.send({
    channel: '#development',
    username: 'Derp bot',
    text: 'Herp a derp',
    attachments: [{
      fallback: 'Herp a derp',
      image_url: item.link
    }]
  });

  this.body = '';

}