var express = require('express');
var app = express();
var bodyParser  = require('body-parser');
var session = require('express-session');
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schemaUser = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  status: Number
});
var schemaProfile = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    default: ''
  },
  level: { type: Number, default: 1 },
  goods: Array,
  cash:  { type: Number, default: 10 },
  origin: String,
  avatar: String,
  stat: {
    wins: { type: Number, default: 0 },
    looses: { type: Number, default: 0 },
    draws: { type: Number, default: 0 }
  }
});

var User = mongoose.model('User', schemaUser);
var Profile = mongoose.model('Profile', schemaProfile);

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://student:student@ds061807.mlab.com:61807/mongo-deivan');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ 
  secret: 'ababagalamaga',
  resave: false,
  saveUninitialized: true
}));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/news', function (req, res) {
    res.sendFile(__dirname + '/public/news.html');
});

app.get('/about', function (req, res) {
    res.sendFile(__dirname + '/public/about.html');
});

app.get('/contact', function (req, res) {
    res.sendFile(__dirname + '/public/contacts.html');
});

app.get('/game', function (req, res) {
    if (req.session.user) {
      res.sendFile(__dirname + '/public/game.html');
    } else {
      res.sendFile(__dirname + '/public/error.html');
    }
});

app.get('/logout', function (req, res) {
  delete req.session.user;
  res.redirect('/');
});

app.get('/login', function (req, res) {
  res.redirect('/');
});

app.post('/login', function (req, res) {
  User.findOne({
    username: req.body.username
  }, function(err, user) {
      if (err) throw err;
      if (!user) {
        res.sendFile(__dirname + '/public/error.html');
      } else {
        console.log('user:', user)
        if (user.password != req.body.password) {
          res.sendFile(__dirname + '/public/error.html');
        } else {
          req.session.user = user;
          res.redirect('/game');
        }
      }
  });
});
// API methods

app.get('/api/profile', function (req, res) {
  if (req.session.user) {
    Profile.findOne({
      username: req.session.user.username
    }, function(err, profile) {
        if (err) throw err;
        if (!profile) {
          var newProfile = new Profile({ username: req.session.user.username });
          newProfile.save(function (err, profile) {
            console.log('Error: ', err)
            if (!err) {
              res.json(profile);
            } else {
              res.json({error: true});
            }
          });
        } else {
//          res.setHeader('Content-Type', 'application/json');
//          res.send(JSON.stringify(profile));
          res.json(profile);
        }
    });    
  } else {
    res.sendFile(__dirname + '/public/error.html');
  }
});

app.listen(port);
console.log('Web-app was started at port ' + port);