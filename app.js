var express = require('express');
var app = express();
var expressWs = require('express-ws')(app)

app.use(express.static(__dirname + '/public'))

var concat = require('concat-stream');
app.use(function(req, res, next) {
  req.pipe(concat(function(data) {
    req.body = data;
    next();
  }));
});

app.ws('/exercise', function(ws, req) {
});
var aWss = expressWs.getWss('/exercise');
app.post('/exercise/:userId/:sessionId', function(req, res) {
  console.log(req.body.toString('utf-8'));
  res.type('application/json');
  res.send('{}');
  aWss.clients.forEach(function (client) {
    client.send(req.body.toString('utf-8'));
  });
});

app.listen(process.env.PORT || 8080);
