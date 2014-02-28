var express = require('express');
var app = express();
var util = require('util');
app.set('view engine', 'jade');
app.use(app.router);

// model definition
var User = require('./lib/user');
// controllers definition
var controller = require('./lib/controller')(User);
// routing
require('./lib/routes')(app, controller);

app.listen(3000);
console.log('Listening on port 3000');

routes = Object.keys(app.routes).reduce(function(prev, curr){
  return prev.concat(app.routes[curr]);
}, []);

console.log(util.inspect(routes, {depth: 4, color: true}));
