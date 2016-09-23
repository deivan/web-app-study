var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var appData = {
    visitors: 0,
    userAgents: []
};

app.get('/', function (req, res) {
    appData.visitors++;
    appData.userAgents.push(req.headers['user-agent']);
    res.send('Welcome! You are in the core of our application!');  
});

app.get('/statistic', function (req, res) {
    res.write('Visitor statistic.\nWe have ' + appData.visitors + ' already.\n');
    for (var i = 0, l = appData.userAgents.length; i < l; i++)
        res.write(i + ': ' + appData.userAgents[i] + '\n');
    res.end('===\nLog end.');
});

app.listen(port);
console.log('Web-app was started at port ' + port);