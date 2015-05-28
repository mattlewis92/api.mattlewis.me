var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.json({hello: 'World!'});
});

app.listen(3000);