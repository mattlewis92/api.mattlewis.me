const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('koa-cors');
const compress = require('koa-compress');
const helmet = require('koa-helmet');
const bluebird = require('bluebird');
const cache = require('memory-cache');
const cash = require('koa-cash');
const router = require('./routes');

const PORT = process.env.PORT || 5000;
const app = koa();
app.proxy = true;

app.use(function* (next) {
  try {
    yield next;
  } catch (err) {
    this.status = err.status || 400;
    this.body = {message: err.message};
    this.app.emit('error', err, this);
  }
});

app
  .use(compress({
    level: 9
  }))
  .use(cors())
  .use(helmet.defaults())
  .use(bodyParser())
  .use(cash({
    get: function(key) {
      return bluebird.resolve(cache.get(key));
    },
    set: function(key, value) {
      return bluebird.resolve(cache.put(key, value, 5 * 60 * 1000));
    }
  }))
  .use(router.routes())
  .use(router.allowedMethods());

app.use(function* () {
  this.status = 404;
  this.body = {message: 'Route not found'};
});

app.listen(PORT);