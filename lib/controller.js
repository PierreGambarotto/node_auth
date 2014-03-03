module.exports = function(User){
  function index(req, res) {
    if (req.session.login === undefined) {
      res.render('index');
    } else {
      res.redirect('/private');
    }
  }

  function session_new(req, res) {
    res.render('session/new');
  }
  function session_create(req, res) {
    if (User.authenticate(req.body.login, req.body.password)) {
      req.session.login = req.body.login;
      res.redirect(req.session.redirect_to || '/private');
      delete req.session.redirect_to
    } else {
      res.render('session/new', {message: "mauvais login/mot de passe"});
    }
  }
  function private_index(req, res){
    if (req.session.login === undefined) {
      req.session.redirect_to = req.path;
      res.redirect('/session/new');
    } else {
      res.render('private', {login: req.session.login});
    }
  }
  function session_destroy(req, res){
    delete req.session.login
    res.redirect('/');
  }
  return { 
    index: index,
    session_new: session_new,
    session_create: session_create,
    private_index: private_index,
    session_destroy: session_destroy };

}
