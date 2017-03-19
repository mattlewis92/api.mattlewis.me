const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('kcors');
const compress = require('koa-compress');
const helmet = require('koa-helmet');
const cache = require('memory-cache');
const cash = require('koa-cash');
const responseTime = require('koa-response-time');
const routes = require('./routes');

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
  .use(routes)
  .use(function* () { //default route
    this.status = 404;
    this.body = {message: 'Route not found'};
  });

app.listen(PORT);

module.exports = app;

console.log(`App listening on http://127.0.0.1:${PORT}`); //eslint-disable-line no-console