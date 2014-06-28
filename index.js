var express = require('express');
var app = express();

app.get('/', function(req, res){
  res.send('hello world');
});

var PORT = process.env.PORT || 3000;

app.listen(PORT);