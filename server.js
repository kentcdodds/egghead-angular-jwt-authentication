// general requires
var express = require('express');
var faker = require('faker');
var path = require('path');

// create the app
var app = express();

////////// authentication stuff
// requires
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// database
var user = {
  username: 'kentcdodds',
  password: 'p'
};

// cookie and session stuff
app.use(cookieParser());
app.use(session({
  name: 'sessionId',
  secret: 'fjkdfeiow389024!',
  saveUninitialized: true,
  resave: true
}));

app.use(bodyParser.json());

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
  res.json(req.user);
});

app.get('/logout', checkAuthenticated, function(req, res) {
  req.logout();
  res.json({ success: true });
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
    res.status(403).end('Must be authenticated');
  }
}