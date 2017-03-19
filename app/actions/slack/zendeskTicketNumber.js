const Slack = require('node-slack');

const slack = new Slack(process.env.SLACK_WEBHOOK);

module.exports = async ctx => {

  const ticketId = ctx.request.body.text.replace('#', '').trim();
  const message = {
    channel: `#${ctx.request.body.channel_name}`,
    username: 'Zendesk ticket link',
    icon_emoji: ':snorlax:',
    text: `https://socialsignin.zendesk.com/agent/tickets/${ticketId}`
  };

  if (!ticketId.match(/^\d+$/)) {
    message.icon_emoji = ':middle_finger:';
    message.text = 'Ticket ids can only be numeric numbers';
  }

  await slack.send(message);

  ctx.body = '';

};