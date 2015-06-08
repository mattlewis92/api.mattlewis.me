var koa = require('koa');
var bodyParser = require('koa-bodyparser');
var cors = require('koa-cors');
var compress = require('koa-compress');
var helmet = require('koa-helmet');
var router = require('./routes');

const PORT = process.env.PORT || 5000;
var app = koa();
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