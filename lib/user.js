var users = {};

function User(login, password){
  this.login = login;
  this.password = password;
  users[login] = password;
}

User.authenticate = function(login,password) {
  return users[login] === password;
}

module.exports = User;
