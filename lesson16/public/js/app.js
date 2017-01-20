angular.module('app',['ngRoute'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl : 'game-profile.html',
        controller: 'ProfilePage'
      })
      .when('/equipment', {
        template : '<h1>Eqquipment page</h1>'
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
  });