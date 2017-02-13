angular.module('app',['ngRoute'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl : 'game-profile.html',
        controller: 'ProfilePage'
      })
      .when('/equipment', {
        templateUrl : 'game-equipment.html',
        controller: 'EquipmentPage'
      })
      .when('/messages', {
        templateUrl : 'game-messages.html',
        controller: 'MessagesPage'
      })
      .when('/messages/:id/view', {
        templateUrl : 'game-message-view.html',
        controller: 'MessageViewPage'
      })
      .when('/mini', {
        templateUrl : 'game-minigames.html',
        controller: 'MinigamesPage'
      })
      .when('/mini/luckystones', {
        templateUrl : 'game-minigames-luckystones.html',
        controller: 'MinigamesLSPage'
      })
      .when('/mini/crazyrace', {
        templateUrl : 'game-minigames-crazyrace.html',
        controller: 'MinigamesCRPage'
      });
  })
  
  .run(function($rootScope){
    $rootScope.messages = [];
    var socket = new WebSocket('ws://demenkov.dp.ua:8001');
    
    socket.onopen = function() {
      console.log("Соединение установлено.");
    };

    socket.onclose = function(event) {
      console.log('Код: ' + event.code + ' причина: ' + event.reason);
    };

    socket.onmessage = function(event) {
      console.log("Получены данные " + event.data);
      $rootScope.messages.push(event.data);
      $rootScope.$apply();
    };

    socket.onerror = function(error) {
      console.log("Ошибка " + error.message);
    };
    
    $rootScope.sendToSocket = function (data) {
      socket.send(data);
    };
    
    //$rootScope.sendToSocket('ababagalamaga');
  });