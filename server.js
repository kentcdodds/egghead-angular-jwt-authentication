var express = require('express');
var faker = require('faker');

var app = express();

var cors = require('cors');

// setup cors
app.use(cors());

app.get('/random-user', function(req, res) {
  var user = faker.Helpers.userCard();
  user.avatar = faker.Image.avatar();
  res.json(user);
});

app.listen(3000, function() {
  console.log('App listening on localhost:3000');
});