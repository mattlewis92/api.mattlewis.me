const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('kcors');
const compress = require('koa-compress');
const helmet = require('koa-helmet');
const cache = require('memory-cache');
const cash = require('koa-cash');
const responseTime = require('koa-response-time');
const routes = require('./routes');

const PORT = process.env.PORT || 5000;
const app = new Koa();
app.proxy = true;

app
  .use(async(ctx, next) => { // error handler middleware
    try {
      await next();
    } catch (err) {
      ctx.status = err.status || 400;
      ctx.body = {message: err.message};
      ctx.app.emit('error', err, ctx);
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
      return Promise.resolve(cache.put(key, {data: value, createdAt: Date.now()}));
    }
  }))
  .use(routes)
  .use(async ctx => { //default route
    ctx.status = 404;
    ctx.body = {message: 'Route not found'};
  });

app.listen(PORT, () => console.log(`App listening on http://127.0.0.1:${PORT}`)); //eslint-disable-line no-console

module.exports = app;
