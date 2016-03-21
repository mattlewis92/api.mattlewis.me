import fetch from 'node-fetch';
import Slack from 'node-slack';
const slack = new Slack(process.env.SLACK_WEBHOOK);

export default function* () {

  const result = yield fetch(`http://api.urbandictionary.com/v0/define?term=${this.request.body.text}`);
  const resultBody = yield result.json();

  resultBody.list.sort(function(a, b) {
    return b.thumbs_up - a.thumbs_up;
  });

  const topResult = resultBody.list[0];

  yield slack.send({
    channel: `#${this.request.body.channel_name}`,
    username: 'Urban dictionary',
    icon_url: 'http://i.imgur.com/wrd6aDd.png',
    text: `<${topResult.permalink}|${this.request.body.text}>: ${topResult.definition}`,
    attachments: [{
      fallback: topResult.definition,
      text: `Example: ${topResult.example}`
    }]
  });

  this.body = '';

}