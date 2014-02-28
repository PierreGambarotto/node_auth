var should = require('should');
var sinon = require('sinon');

var User = require('../lib/user');
var controller = require('../lib/controller')(User),
    req = {
      session: {}
    },
    res = {
      render: function(){}
    }

describe('Application Controller', function(){
  describe('#index', function(){
    it('renders the index template', function(){
      // la fonction render doit être appelée sur res avec les paramètres 'index'

      // avec une fonction espion, et should pour les assertions :
        sinon.spy(res, 'render')
        // appel du code réel
        controller.index(req,res)
        // appelée exactement une fois
        res.render.calledOnce.should.be.true 
        // lors du premier appel, arguments == ['index']
        res.render.firstCall.args.should.eql(['index']) 
        // restauration de la fonction initiale
        res.render.restore()

      // idem en utilisant un mock  
        var mock = sinon.mock(res)
        // définition de l'appel attendu
        mock.expects('render').once().withExactArgs('index');
        // appel du code
        controller.index(req, res)
        // vérification des assertions
        mock.verify()
        // restauration de l'objet initial
        mock.restore()
    })
  })

  describe('#session_new', function(){
    it('renders the template session/new', function(){
    // à vous de jouer, c'est le même cas que #index
      var mock = sinon.mock(res)
      mock.expects('render').once().withExactArgs('session/new')
      controller.session_new(req,res)
      mock.verify()
      mock.restore()
    
    })

  })

  describe('#session_create', function(){
    context('with login=bob and password=secret', function(){
      before(function(){
        req.param = {}
        req.param.login = 'bob'
        req.param.password = 'secret'
        res.redirect = function(){}
      })
      it('calls User#authenticate with (bob,secret)',function(){
        var mock = sinon.mock(User);
        mock.expects('authenticate').once().withExactArgs(req.param.login, req.param.password);
        controller.session_create(req, res)
        mock.verify()
        mock.restore()
      })
      context('when the given credentials are incorrect', function(){
        var stub
        before(function(){
          stub = sinon.stub(User, 'authenticate')
          // stub User#authenticate(bob, secret) to return false
          stub.withArgs(req.param.login, req.param.password).returns(false)
        })
        it('renders the session/new template with the message "mauvais login/mot de passe"', function(){
          var mock = sinon.mock(res);
          mock.expects('render').withExactArgs('session/new', {message: "mauvais login/mot de passe"})
          controller.session_create(req, res)
          mock.verify()
          mock.restore()
        })
        it('does not redirect', function(){
          var mock = sinon.mock(res);
          mock.expects('redirect').never();
          controller.session_create(req, res)
          mock.verify()
          mock.restore()
        })
        after(function(){
          stub.restore()
        })
      })
      context('when the authentication is successful', function(){
        var stub
        before(function(){
          stub = sinon.stub(User, 'authenticate')
          // stub User#authenticate(bob, secret) to return true
          stub.withArgs(req.param.login, req.param.password).returns(true)
        })
        it('redirects to /private', function(){
          var mock = sinon.mock(res)
          mock.expects('redirect').once().withExactArgs('/private')
          controller.session_create(req, res)
          mock.verify()
          mock.restore()
        })
        it('stores the login in the session', function(){
          controller.session_create(req, res)
          req.session.login.should.eql(req.param.login)
        });
        after(function(){
          stub.restore()
        })
      })
    })
  })
})

