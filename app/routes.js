import route from 'koa-route';
import compose from 'composition';
import defaultAction from './actions/default';
import tweetsAction from './actions/getTweets';
import githubAction from './actions/githubActivity';
import sendEmailAction from './actions/sendEmail';

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
  route.post('/contact', compose([sendEmailAction]))
];

export default compose(routes);