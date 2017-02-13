var WebSocketServer = new require('ws');

// подключенные клиенты
var clients = {};

var wss = new WebSocketServer.Server({
  port: 8001
});
wss.on('connection', function (ws) {

  var id = Math.random();
  clients[id] = ws;
  console.log("новое соединение " + id);

  ws.on('message', function(message) {
    console.log('получено сообщение ' + message);
    if (message != 'ababagalamaga') {
      for (var key in clients)
        clients[key].send(message);
    }
  });

  ws.on('close', function() {
    console.log('соединение закрыто ' + id);
    delete clients[id];
  });

});