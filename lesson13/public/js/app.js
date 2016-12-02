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
  })
  
  .controller('mainPage', function ($scope, $rootScope) {
    $rootScope.profile = {};
    $rootScope.me = 'Adam'; //$rootScope.profile.username;
    $rootScope.conversations = [
      {
        _id: 1,
        authors: ['Snake', 'Adam'],
        messages: [
          { date: '2016-11-29 09:10', author: 'Adam', text: 'Hello, how R U?'},
          { date: '2016-11-29 09:12', author: 'Snake', text: 'tnx im 5n'}
        ]
      },
      {
        _id: 2,
        authors: ['Eve', 'Adam'],
        messages: [
          { date: '2016-11-30 10:15', author: 'Adam', text: 'Hello, Eve, it is Adam.Do you wanna an apple?'},
          { date: '2016-11-30 12:15', author: 'Eve', text: 'mmmmm... are you about macbook?'},
          { date: '2016-11-30 13:10', author: 'Adam', text: 'stupid blondy i am about meet for you!!!'}
        ]
      }
    ];
    $rootScope.getMate = function (authors) {
      if (authors[0] == $rootScope.me) {
        return authors[1];
      } else {
        return authors[0];
      }
    };
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
  
  .controller('MessagesPage', function ($scope, $rootScope) {
    
    $scope.users = [
      {username:'Adam'},
      {username:'Eve'},
      {username:'Snake'}
    ];
    
  })
  
  .controller('MessageViewPage', function ($scope, $rootScope, $routeParams) {
    var id = $routeParams.id;
    $scope.conversation = {};
    for (var i = 0; i < $rootScope.conversations.length; i++) {
      if ($rootScope.conversations[i]._id == id) {
        $scope.conversation = $rootScope.conversations[i];
        console.log('conv',$scope.conversation)
      }
    }
      
  });