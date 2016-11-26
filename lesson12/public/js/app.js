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
  })
  
  .controller('mainPage', function ($scope, $rootScope, $http) {
    $rootScope.profile = {};
  })
  
  .controller('ProfilePage', function ($scope, $rootScope, $http) {
    
    $http({
      method: 'GET',
      url: '/api/user'
    }).then(function successCallback (response) {
        $rootScope.profile = response.data;
    }, function errorCallback (response) {
      console.log('Error: ',response);
    });
    
    $scope.message = '';
    
    $scope.updateProfile = function () {
      $http({
        method: 'POST',
        url: '/api/user',
        data: {
          avatar: $rootScope.profile.avatar,
          email: $rootScope.profile.email,
          origin: $rootScope.profile.origin
        }
      }).then(function successCallback (response) {
        $scope.message = response.data;
       }, function errorCallback (response) {
        console.log('Error: ',response);
      });
    };
  })
  
  .controller('MessagesPage', function ($scope, $rootScope, $http) {
    var me = 'Adam'; //$rootScope.profile.username;
    $scope.users = [
      {username:'Adam'},
      {username:'Eve'},
      {username:'Snake'}
    ];
    $scope.conversations = [
      {
        _id: 1,
        authors: ['Snake', 'Adam'],
        messages: [
          { date: 1479462858686, author: 'Adam', text: 'Hello, how R U?'},
          { date: 1479462859888, author: 'Snake', text: 'Hello, how R U?'}
        ]
      },
            {
      _id: 2,
        authors: ['Eve', 'Adam'],
        messages: [
          { date: 1479462858686, author: 'Adam', text: 'Hello, how R U?'},
          { date: 1479462859999, author: 'Eve', text: 'Hello, how R U?'}
        ]
      }
    ];
  });