var express = require('express');
var app = express();
var bodyParser  = require('body-parser');
var port = process.env.PORT || 3000;
var appData = {
    visitors: 0,
    userAgents: []
};
var session = require('express-session');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  status: Number,
  email: String
});

var User = mongoose.model('User', schema);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://student:student@ds061807.mlab.com:61807/mongo-deivan');

var user = new User ({ username: 'test01', password: 'test01' });

user.save().then(function(err,user) {
  if (err) {
    console.log('Error',err);
  } else {
    console.log('+ new dumb user saved!',user);
  }
});

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ 
  secret: 'ababagalamaga',
  resave: false,
  saveUninitialized: true
}));

app.get('/', function (req, res) {
    appData.visitors++;
    appData.userAgents.push(req.headers['user-agent']);
    res.sendFile(__dirname + '/public/index.html');
});
app.post('/', function (req, res) {
   res.sendFile(__dirname + '/public/index.html'); 
});

app.get('/news', function (req, res) {
    appData.visitors++;
    res.sendFile(__dirname + '/public/news.html');
});

app.get('/about', function (req, res) {
    appData.visitors++;
    res.sendFile(__dirname + '/public/about.html');
});

app.get('/contact', function (req, res) {
    appData.visitors++;
    res.sendFile(__dirname + '/public/contacts.html');
});

app.get('/login', function (req, res) {
    if (req.session.user) {
      appData.visitors++;
      res.sendFile(__dirname + '/public/success.html');
    } else {
      res.sendFile(__dirname + '/public/error.html');
    }
});

app.get('/logout', function (req, res) {
  delete req.session.user;
  res.redirect('/');
});

app.post('/login', function (req, res) {
  console.log('req.body:', req.body)
  User.findOne({
    username: req.body.username
  }, function(err, user) {
      console.log('user:', user)
      if (err) throw err;
      if (!user) {
        res.sendFile(__dirname + '/public/error.html');
      } else {
        console.log('user:', user)
        if (user.password != req.body.password) {
          res.sendFile(__dirname + '/public/error.html');
        } else {
          req.session.user = user;
          res.sendFile(__dirname + '/public/success.html');
        }
      }
  });
});

app.listen(port);
console.log('Web-app was started at port ' + port);