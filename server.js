var express = require('express');
var app = express();
var util = require('util');
app.set('view engine', 'jade');
// to populate req.body with POST params
app.use(express.bodyParser())
app.use(express.cookieParser());
// secret option is mandatory
app.use(express.session({secret: 'secret12345'}));
app.use(app.router);

// model definition
var User = require('./lib/user');
// populate user database
new User('bob', 'passbob');
new User('foo', 'bar');

// controllers definition
var controller = require('./lib/controller')(User);
// routing
require('./lib/routes')(app, controller);

app.listen(3000);
console.log('Listening on port 3000');
