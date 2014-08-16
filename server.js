// general requires
var express = require('express');
var faker = require('faker');
var path = require('path');

// create the app
var app = express();

////////// authentication stuff
// requires
var cors = require('cors');
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// database
var user = {
  username: 'kentcdodds',
  password: 'p'
};

// parse json data coming from client (used on login)
app.use(bodyParser.json());

// setup cors
app.use(cors());

// setup jwt
var jwtSecret = 'i3oifjda9302lr$#@05.';
app.use(expressJwt({ secret: jwtSecret}).unless({path: ['/login']}));

// setup passport
passport.use(new LocalStrategy(function(username, password, done) {
  if (username === user.username && password === user.password) {
    done(null, user);
  } else {
    done(null, false, { message: 'Invalid username or password' });
  }
}));

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
  if (username === user.username) {
    done(null, user);
  } else {
    done('No user with username ' + username);
  }
});

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/random-user', checkAuthenticated, function(req, res) {
  var user = faker.Helpers.userCard();
  user.avatar = faker.Image.avatar();
  res.json(user);
});

app.post('/login', passport.authenticate('local'), function(req, res) {
  var token = jwt.sign({
    username: req.user.username
  }, jwtSecret);

  res.json({
    token: token,
    user: user
  });
});

app.get('/me', checkAuthenticated, function(req, res) {
  res.json(req.user);
});

app.listen(3000, function() {
  console.log('server listening on :3000');
});

// UTIL FUNCTIONS

function checkAuthenticated(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.status(401).end('Must be authenticated');
  }
}