var should = require('should');
var express = require('express');
var util = require('util');
var inspect = util.inspect;
var app = express();

// to have app.VERB with VERB in ['get', 'post', 'put', 'patch', 'del']
app.use(app.router);

// decoy controller
var controller = { 
  index: function index(){}
  , session_new: function session_new(){}
  , session_create: function session_create(){}
  , private_index: function private_index(){}
  , session_destroy: function session_destroy(){}
};
// include code to assert on
require('../lib/routes')(app,controller);

// routes indexed by verb, so
var routes = Object.keys(app.routes).reduce(function(acc, verb){
  return acc.concat(app.routes[verb]);
}, []);

//console.log(inspect(routes, {depth: null}));

/* route is something like
 * {
 *   path: '…',
 *   method: 'get|post|put|patch|del',
 *   callbacks: [ [Function: …]],
 *   keys: [ …],
 *   regexp: /…/
 * }
 */


 // assert that app routes GET '/'
 // hint : routes.should.containDeep 
 // see should.js documentation : https://github.com/visionmedia/should.js/

routes.should.containDeep([{path:'/', method:'get'}]);

describe('Application', function(){
  describe('Routing layer', function(){
    it('handles get /', function(){
      routes.should.containDeep([{path:'/', method:'get'}]);
    })
    it('handles get /session/new', function(){
      routes.should.containDeep([{path:'/session/new', method:'get'}]);
    })
    it('handles post /session', function(){
      routes.should.containDeep([{path:'/session', method:'post'}]);
    })
    it('handles get /private', function(){
      routes.should.containDeep([{path:'/private', method:'get'}]);
    })
    it('handles get /logout', function(){
      routes.should.containDeep([{path:'/logout', method:'get'}]);
    })
  })
})
