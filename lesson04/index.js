var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var appData = {
    visitors: 0,
    userAgents: []
};

app.get('/', function(req, res) {
    console.log(req.headers);
    res.send('Welcome! You are in the core of our application!');  
});

app.listen(port);
console.log('Web-app was started at port ' + port);