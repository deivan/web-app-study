var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var appData = {
    visitors: 0,
    shows: 0,
    userAgents: []
};

app.set('view engine', 'ejs'); 

app.get('/', function (req, res) {
    appData.visitors++;
    appData.userAgents.push(req.headers['user-agent']);
    res.send('Welcome! You are in the core of our application!');  
});

app.get('/users', function (req, res) {
    appData.visitors++;
    res.sendFile(__dirname + '/users.html');
});

app.get('/image', function (req, res) {
    appData.shows++;
    res.sendFile(__dirname + '/image01.jpg');
});

app.get('/statistic', function (req, res) {
    res.render('stat', { visitors: appData.visitors, shows: appData.shows, ua: appData.userAgents });
});

app.listen(port);
console.log('Web-app was started at port ' + port);