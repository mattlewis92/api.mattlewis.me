if (process.env.NODE_ENV === 'production') {
  require('newrelic');
}
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(cors());

app.use(bodyParser.json());

app.use('/me', require('./routes'));

app.use(function(err, req, res, next) {
  res.status(400).json({message: err.message});
});

app.use(function(req, res) {
  res.status(404).json({message: 'Route not found'});
});

app.listen(app.get('port'));