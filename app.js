var express = require('express');
var bodyParser = require('body-parser');

var app = express();

var mongo = require('mongodb');
var monk = require('monk');

var dburi = require('fs').readFileSync('/var/w3/dburi.txt','utf8');
var db = monk(dburi);


app.use(bodyParser());
app.use(express.static(__dirname + '/public'));
app.use(function(req, res, next) {
  req.db = db;
  next();
})

app.post('/register', require('./app/register'));
app.get('/unregister', require('./app/unregister'));

var port = 80;
app.listen(port, function(){
  console.log("Listening on " + port);
})

