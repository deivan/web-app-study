var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var appData = {
    visitors: 0,
    userAgents: []
};

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

app.get('/profile', function (req, res) {
    res.sendFile(__dirname + '/public/profile.html');
});

app.get('/statistic', function (req, res) {
    res.write('Total visitors: ' + appData.visitors + '\n');
    for (var i=0, l = appData.userAgents.length; i < l; i++)
        res.write(i + ': ' + appData.userAgents[i] + '\n');
    res.end();
});

app.listen(port);
console.log('Web-app was started at port ' + port);