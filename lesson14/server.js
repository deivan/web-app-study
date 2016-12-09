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
  status: { type: Number, default: 1 },
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

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://student:student@ds061807.mlab.com:61807/mongo-deivan');

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/public');
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

app.get('/signup', function (req, res) {
    res.sendFile(__dirname + '/public/signup.html');
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

app.post('/signup', function (req, res) {
  console.log('body:', req.body);
  var user;
    User.findOne({
      username: req.body.username
    }, function(err, user) {
        if (err) throw err;
        if (user) {
          res.render('signup', { error: {username: true}, success: false });
        } else {
          User.findOne({
            email: req.body.email
          }, function(err, user) {
              if (err) throw err;
              if (user) {
                res.render('signup', { error: {email: true}, success: false });
              } else {
                if (req.body.password.trim() == '') {
                  res.render('signup', { error: {password: true}, success: false });
                } else {
                  user = new User({
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    avatar: req.body.avatar,
                    origin: req.body.origin
                  });
                  user.save();
                  res.render('signup', { error: false, success: true });
                }
              }
          }); 
        }
    });  
});

// API methods

app.get('/api/user', function (req, res) {
  if (req.session.user) {
    User.findOne({
      username: req.session.user.username
    }, function(err, user) {
        if (err) throw err;
        if (!user) {
          res.json({error: true, status: 'User not found.'});
        } else {
          res.json(user);
        }
    });  
  } else {
    res.sendFile(__dirname + '/public/error.html');
  }
});

app.post('/api/user', function (req, res) {
  if (req.session.user) {
    User.findOneAndUpdate({
      username: req.session.user.username
    }, {
      avatar: req.body.avatar,
      email: req.body.email,
      origin: req.body.origin
    },
    { upsert: true, new: true },
    function(err, user) {
      if (!err) {
        res.json({error: false, status: 'Profile updated successfully.'});
      } else {
        res.json({error: true, status: "Can't update profile data"});
      }
    }); 
  }
});

app.get('/api/users', function (req, res) {
  if (req.session.user) {
    User.find({}, 
    function(err, users) {
      var names = [];
      if (!err) {
        for (var i = 0; i < users.length; i++)
          names.push({username: users[i].username});
        res.json({error: false, status: 'Got usernames', data: names});
      } else {
        res.json({error: true, status: "Can't get userlist"});
      }
    }); 
  }
});

app.listen(port);
console.log('Web-app was started at port ' + port);