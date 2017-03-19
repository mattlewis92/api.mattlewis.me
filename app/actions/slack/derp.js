const fetch = require('node-fetch');
const Slack = require('node-slack');

const slack = new Slack(process.env.SLACK_WEBHOOK);
const IMGUR_CLIENT_ID = 'de44c1f57f60e41';

module.exports = function* () {

  const result = yield fetch('https://api.imgur.com/3/gallery/r/derp/0', {
    headers: {
      Authorization: 'Client-ID ' + IMGUR_CLIENT_ID
    }
  });

  const images = yield result.json();

  const item = images.data[Math.floor(Math.random() * images.data.length)];

  yield slack.send({
    channel: `#${this.request.body.channel_name}`,
    username: 'Derp bot',
    icon_emoji: ':troll:',
    text: 'Herp a derp',
    attachments: [{
      fallback: 'Herp a derp',
      image_url: item.link
    }]
  });

  this.body = '';

}