var express = require('express');
var concat = require('concat-stream');
var app = express();

app.use(function(req, res, next){
  req.pipe(concat(function(data){
    req.body = data;
    next();
  }));
});

app.post('/exercise/:userId/:sessionId', function(req, res) {
  console.log(req.body.toString('utf-8'));
  res.type('application/json');
  res.send('{}');
});

app.listen(process.env.PORT || 8080);