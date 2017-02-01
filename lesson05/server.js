var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 3000;
var appData = {
    visitors: 0,
    userAgents: [],
    messages: []
};

app.use(express.static(__dirname + '/public')); // set a folder where is static
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/', function (req, res) {
    appData.visitors++;
    appData.userAgents.push(req.headers['user-agent']);
    res.sendFile(__dirname + '/public/main.html');
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
    console.log(req.body);
    appData.messages.push(req.body);
    res.sendFile(__dirname + '/public/contacts.html');
});

app.get('/statistic', function (req, res) {
    res.write('Total visitors: ' + appData.visitors + '\n');
    for (var i=0, l = appData.userAgents.length; i < l; i++)
        res.write(i + ': ' + appData.userAgents[i] + '\n');
    res.write('============================================================\n');
    res.write('Messages from users:\n');
    for (var i=0, l = appData.messages.length; i < l; i++)
        res.write('User ' + appData.messages[i].name + ' wrote: ' + appData.messages[i].message + '\n');
    res.end();
});

app.listen(port);
console.log('Web-app was started at port ' + port);