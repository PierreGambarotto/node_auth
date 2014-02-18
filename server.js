var express = require('express');
var app = express();
var util = require('util');
app.set('view engine', 'jade');
app.use(app.router);

app.get('/', index);
app.get('/session/new', session_new);
app.post('/session', session_create);
app.get('/private', private_index);
app.get('/logout', session_destroy);
app.get('/test/:id', session_new);

function index(req, res) {
  res.render('index');
}
function session_new(req, res) {
  res.render('session/new');
}
function session_create(req, res) {
  res.redirect('/private');
}
function private_index(req, res){
  res.render('private');
}
function session_destroy(req, res){
  res.redirect('/');
}
app.listen(3000);
console.log('Listening on port 3000');

// routes : concatène les routes de app.routes
var routes = [];
Object.keys(app.routes).forEach(function(verb){
  routes = routes.concat(app.routes[verb]);
});

console.log(util.inspect(routes, {depth: 4, color: true}));

