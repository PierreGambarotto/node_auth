module.exports = function(User){
  function index(req, res) {
    res.render('index');
  }
  function session_new(req, res) {
    res.render('session/new');
  }
  function session_create(req, res) {
    if (User.authenticate(req.param.login, req.param.password)) {
      req.session.login = req.param.login;
      res.redirect('/private');
    } else {
      res.render('session/new', {message: "mauvais login/mot de passe"});
    }
  }
  function private_index(req, res){
    res.render('private');
  }
  function session_destroy(req, res){
    res.redirect('/');
  }
  return { 
    index: index,
    session_new: session_new,
    session_create: session_create,
    private_index: private_index,
    session_destroy: session_destroy };

}
