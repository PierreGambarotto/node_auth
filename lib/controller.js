module.exports = { 
  index: index,
  session_new: session_new,
  session_create: session_create,
  private_index: private_index,
  session_destroy: session_destroy };

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
