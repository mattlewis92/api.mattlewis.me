if (process.env.NODE_ENV === 'production') {
  require('newrelic');
}
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use('/', require('./routes'));

app.listen(app.get('port'));