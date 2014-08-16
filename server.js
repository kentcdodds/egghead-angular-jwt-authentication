var express = require('express');
var faker = require('faker');
var path = require('path');

var app = express();

app.get('/random-user', function(req, res) {
  var user = faker.Helpers.userCard();
  user.avatar = faker.Image.avatar();
  res.json(user);
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, function() {
  console.log('server listening on :3000');
});