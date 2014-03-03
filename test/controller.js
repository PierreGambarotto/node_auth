var should = require('should');
var sinon = require('sinon');

var User = require('../lib/user');
var controller = require('../lib/controller')(User),
    req = {
      param: {},
      session: {}
    },
    res = {
      render: function(){},
      redirect: function(){}
    }

describe('Application Controller', function(){
  describe('#index', function(){
    context('when the user is already connected', function(){
      it('redirects to /private', function(){
        req.session.login = function(){return "bob"}
        var stub = sinon.stub(req.session, 'login')
        stub.returns(undefined)
        var mock = sinon.mock(res)
        mock.expects('redirect').once().withExactArgs('/private')
        controller.index(req, res)
        mock.verify()
        stub.restore()
        mock.restore()
        delete req.session.login
      })
    })
    context('whith no session', function(){
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
        req.body = {}
        req.body.login = 'bob'
        req.body.password = 'secret'
      })
      after(function(){
        delete req.body
      })
      it('calls User#authenticate with (bob,secret)',function(){
        var mock = sinon.mock(User);
        mock.expects('authenticate').once().withExactArgs(req.body.login, req.body.password);
        controller.session_create(req, res)
        mock.verify()
        mock.restore()
      })
      context('when the given credentials are incorrect', function(){
        var stub
        before(function(){
          stub = sinon.stub(User, 'authenticate')
          // stub User#authenticate(bob, secret) to return false
          stub.withArgs(req.body.login, req.body.password).returns(false)
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
          stub.withArgs(req.body.login, req.body.password).returns(true)
        })
        it('stores the login in the session', function(){
          controller.session_create(req, res)
          req.session.login.should.eql(req.body.login)
        });
        context('when session.redirect_to==/redirect_path', function(){
          before(function(){
            req.session.redirect_to='/redirect_path'
          })
          it('redirects to session.redirect_to', function(){
            var mock = sinon.mock(res)
            mock.expects('redirect').once().withExactArgs(req.session.redirect_to)
            controller.session_create(req,res)
            mock.verify()
            mock.restore()
          })
          it('deletes sesion.redirect_to', function(){
            controller.session_create(req,res)
            req.session.should.not.have.property('redirect_to')            
          })
          after(function(){
            delete req.session.redirect_to
          })
        })
      context('when no value in session.redirect_to', function(){
        it('redirects to /private', function(){
          var mock = sinon.mock(res)
          mock.expects('redirect').once().withExactArgs('/private')
          controller.session_create(req, res)
          mock.verify()
          mock.restore()
        })
      })
        after(function(){
          stub.restore()
        })
      })
    })
  })

  describe('#private_index', function(){
    context('whith an active session', function(){
      before(function(){
        req.session.login = "bob"
      })
      it('renders the private template with the login', function(){
          var mock = sinon.mock(res);
          mock.expects('render').withExactArgs('private', { login: req.session.login })
          controller.private_index(req, res)
          mock.verify()
          mock.restore()
 
      })

      after(function(){
        delete req.session.login
      })

    })

    context('with no active session', function(){
      it('redirects to the authentication form', function(){
//        should_redirect(controller.private_index, req, res, 'session/new')
        controller.private_index.should_redirect_to('/session/new')
      })

      it('should store the initial path in session with the key redirect_to', function() {
        req.path = "originial path"
        controller.private_index(req, res)
        req.session.redirect_to.should.eql(req.path)
        delete req.path
      })

    })
  })

  describe('#session_destroy', function(){
    it('redirects to /', function(){
      var mock = sinon.mock(res)
      mock.expects('redirect').once().withExactArgs('/')
      controller.session_destroy(req,res)
      mock.verify()
      mock.restore()
    })
    context('with an active user', function(){
      it('disconnects the user', function(){
        req.session.login = 'bob'
        controller.session_destroy(req, res)
        req.session.should.not.have.property('login')
      }) 
    })
  })
})

function should_redirect(f, req, res, path){
  var mock = sinon.mock(res)
  mock.expects('redirect').once().withExactArgs(path)
  f.apply(this, [req, res])
  mock.verify()
  mock.restore()
}

controller.private_index.should_redirect_to = function(path){
  var mock = sinon.mock(res);
  mock.expects('redirect').once().withExactArgs(path)
  this.apply(this, [req, res])
  mock.verify()
  mock.restore()
}

