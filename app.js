var express = require('express');
var app = express();
var expressWs = require('express-ws')(app)
var fs = require('fs');

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
  var json = req.body.toString('utf-8');
  var fileName = __dirname + '/examples/' + req.param('userId') + '-' + req.param('sessionId') + '.json';

  fs.writeFile(fileName, json, function (err) { console.log(err); });
  res.type('application/json');
  res.send('{}');
  aWss.clients.forEach(function (client) {
    client.send(json);
  });
});

app.get('/foo', function(req, res) {
  fs.readFile( __dirname + '/example.json', function (err, data) {
    console.log(data.toString('utf-8'));
    aWss.clients.forEach(function (client) {
      client.send(data.toString('utf-8'));
    });
    res.send("{}");
  });
});

app.listen(process.env.PORT || 8080);

