const fetch = require('node-fetch');
const Slack = require('node-slack');

const slack = new Slack(process.env.SLACK_WEBHOOK);
const IMGUR_CLIENT_ID = 'de44c1f57f60e41';

module.exports = async ctx => {

  const result = await fetch('https://api.imgur.com/3/gallery/r/derp/0', {
    headers: {
      Authorization: 'Client-ID ' + IMGUR_CLIENT_ID
    }
  });

  const images = await result.json();

  const item = images.data[Math.floor(Math.random() * images.data.length)];

  await slack.send({
    channel: `#${ctx.request.body.channel_name}`,
    username: 'Derp bot',
    icon_emoji: ':troll:',
    text: 'Herp a derp',
    attachments: [{
      fallback: 'Herp a derp',
      image_url: item.link
    }]
  });

  ctx.body = '';

};