import koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from 'kcors';
import compress from 'koa-compress';
import helmet from 'koa-helmet';
import cache from 'memory-cache';
import cash from 'koa-cash';
import responseTime from 'koa-response-time';
import router from './routes';

const PORT = process.env.PORT || 5000;
const app = koa();
app.proxy = true;

app
  .use(function* (next) { //error handler middleware
    try {
      yield next;
    } catch (err) {
      this.status = err.status || 400;
      this.body = {message: err.message};
      this.app.emit('error', err, this);
    }
  })
  .use(responseTime())
  .use(compress({
    level: 9
  }))
  .use(cors())
  .use(helmet())
  .use(bodyParser())
  .use(cash({
    maxAge: 5 * 60 * 1000,
    get: (key, maxAge) => {
      const item = cache.get(key);
      if (!item || (new Date().getTime() - item.createdAt) > maxAge) {
        return Promise.resolve();
      }
      return Promise.resolve(item.data);
    },
    set: (key, value) => {
      return Promise.resolve(cache.put(key, {data: value, createdAt: new Date().getTime()}));
    }
  }))
  .use(router.routes())
  .use(router.allowedMethods())
  .use(function* () { //default route
    this.status = 404;
    this.body = {message: 'Route not found'};
  });

app.listen(PORT);

export default app;

console.log(`App listening on http://127.0.0.1:${PORT}`);