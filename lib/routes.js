module.exports = function(app, controller){
  app.get('/', controller.index);
  app.get('/session/new', controller.session_new);
  app.post('/session', controller.session_create);
  app.get('/private', controller.private_index);
  app.get('/private/very_private', controller.private_index);
  app.get('/logout', controller.session_destroy);
}
