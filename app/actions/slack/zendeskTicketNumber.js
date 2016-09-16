import Slack from 'node-slack';
const slack = new Slack(process.env.SLACK_WEBHOOK);

export default function* () {

  const ticketId = this.request.body.text.replace('#', '').trim();
  const message = {
    channel: `#${this.request.body.channel_name}`,
    username: 'Zendesk ticket link',
    icon_emoji: ':snorlax:',
    text: `https://socialsignin.zendesk.com/agent/tickets/${ticketId}`
  };

  if (!ticketId.match(/^\d+$/)) {
    message.icon_emoji = ':middle_finger';
    message.text = 'Ticket ids can only be numeric numbers';
  }

  yield slack.send(message);

  this.body = '';

}