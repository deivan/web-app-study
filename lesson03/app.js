var http = require('http');
var server = http.createServer(function (req,res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Slava Ukraine! Heroyam Slava!');
});
server.listen(8088);
console.log('Server started...');