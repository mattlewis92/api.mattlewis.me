const fetch = require('node-fetch');
const Slack = require('node-slack');

const slack = new Slack(process.env.SLACK_WEBHOOK);

module.exports = async ctx => {

  const result = await fetch(`http://api.urbandictionary.com/v0/define?term=${ctx.request.body.text}`);
  const resultBody = await result.json();

  resultBody.list.sort((a, b) => b.thumbs_up - a.thumbs_up);

  const topResult = resultBody.list[0];

  await slack.send({
    channel: `#${ctx.request.body.channel_name}`,
    username: 'Urban dictionary',
    icon_url: 'http://i.imgur.com/wrd6aDd.png',
    text: `<${topResult.permalink}|${ctx.request.body.text}>: ${topResult.definition}`,
    attachments: [{
      fallback: topResult.definition,
      text: `Example: ${topResult.example}`
    }]
  });

  ctx.body = '';

};