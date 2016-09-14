import Slack from 'node-slack';
const slack = new Slack(process.env.SLACK_WEBHOOK);

export default function* () {

  const ticketId = this.request.body.text;

  yield slack.send({
    channel: `#${this.request.body.channel_name}`,
    username: 'Zendesk ticket link',
    icon_emoji: ':snorlax:',
    text: `https://socialsignin.zendesk.com/agent/tickets/${ticketId}`
  });

  this.body = '';

}