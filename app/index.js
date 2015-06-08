const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('koa-cors');
const compress = require('koa-compress');
const helmet = require('koa-helmet');
const router = require('./routes');

const PORT = process.env.PORT || 5000;
const app = koa();
app.proxy = true;

app.use(function *(next) {
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
  .use(router.routes())
  .use(router.allowedMethods());

app.use(function *() {
  this.status = 404;
  this.body = {message: 'Route not found'};
});

app.listen(PORT);