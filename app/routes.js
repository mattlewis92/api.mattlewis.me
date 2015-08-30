import koaRouter from 'koa-router';
import defaultAction from './actions/default';
import tweetsAction from './actions/getTweets';
import githubAction from './actions/githubActivity';
import sendEmailAction from './actions/sendEmail';

const router = koaRouter();

const cacheCheck = function(expiry) {
  return function* (next) {
    if (yield* this.cashed(expiry)) {
      return;
    }
    yield next;
  }
};

router.get('/', defaultAction);
router.get('/social/tweets', cacheCheck(), tweetsAction);
router.get('/social/github', cacheCheck(), githubAction);
router.post('/contact', sendEmailAction);

export default router;