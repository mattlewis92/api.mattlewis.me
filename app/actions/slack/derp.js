import Slack from 'node-slack';
const slack = new Slack(process.env.SLACK_WEBHOOK);

export default async function() {

  await slack.send({
    channel: '#development',
    username: 'Derp bot',
    text: 'Herp a derp',
    attachments: [{
      fallback: 'Herp a derp',
      image_url: 'http://i.imgur.com/ecrlmId.jpg'
    }]
  });

  this.body = '';

}