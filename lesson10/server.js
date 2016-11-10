var express = require('express');
var app = express();
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
  status: Number,
  email: String
});
var schemaProfile = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  level: Number,
  goods: Array,
  cash: Number,
  origin: String,
  avatar: String,
  stat: {
    wins:Number,
    looses:Number,
    draws:Number
  }
});

var User = mongoose.model('User', schemaUser);
var Profile = mongoose.model('Profile', schemaProfile);

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://student:student@ds061807.mlab.com:61807/mongo-deivan');

app.use(express.static(__dirname + '/public'));

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


app.listen(port);
console.log('Web-app was started at port ' + port);