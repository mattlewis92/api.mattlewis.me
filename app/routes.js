import route from 'koa-route';
import compose from 'composition';
import defaultAction from './actions/default';
import tweetsAction from './actions/social/getTweets';
import githubAction from './actions/social/githubActivity';
import sendEmailAction from './actions/contact/sendEmail';
import slackDerpAction from './actions/slack/derp';
import slackDefineAction from './actions/slack/define';

const cacheCheck = function(expiry) {
  return function* (next) {
    if (yield* this.cashed(expiry)) {
      return;
    }
    yield next;
  };
};

const routes = [
  route.get('/', compose([defaultAction])),
  route.get('/social/tweets', compose([cacheCheck(), tweetsAction])),
  route.get('/social/github', compose([cacheCheck(), githubAction])),
  route.post('/contact', compose([sendEmailAction])),
  route.post('/slack/derp', compose([slackDerpAction])),
  route.post('/slack/define', compose([slackDefineAction]))
];

export default compose(routes);