var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var appData = {
    visitors: 0,
    userAgents: []
};

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

app.get('/', function (req, res) {
    appData.visitors++;
    appData.userAgents.push(req.headers['user-agent']);
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

app.post('/contact', function (req, res) {
    res.end();
});

app.get('/statistic', function (req, res) {
    res.write('Total visitors: ' + appData.visitors + '\n');
    for (var i=0, l = appData.userAgents.length; i < l; i++)
        res.write(i + ': ' + appData.userAgents[i] + '\n');
    res.end();
});

app.listen(port);
console.log('Web-app was started at port ' + port);