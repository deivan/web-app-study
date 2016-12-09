angular.module('app')
  .controller('mainPage', function ($scope, $rootScope,appService) {
    appService.getUser().then(function (response) {
      $rootScope.profile = response;
      $rootScope.me = $rootScope.profile.username;
    }, function (response) {
      console.log('Error: ',response);
    });
    
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
          { date: '2016-11-30 13:10', author: 'Adam', text: 'stupid blondy i am about meet for you!!!'},
          { date: '2016-11-30 13:20', author: 'Eve', text: 'I\'m not a blondy, i am brown'},
          { date: '2016-11-30 13:30', author: 'Adam', text: 'OMG'}
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
  
  .controller('ProfilePage', function ($scope, $rootScope, appService) {
    
    $scope.message = '';
    
    $scope.updateProfile = function () {
      appService.updateProfile({
          avatar: $rootScope.profile.avatar,
          email: $rootScope.profile.email,
          origin: $rootScope.profile.origin
      }).then(function (response) {
        $scope.message = response;
      }, function (response) {
        console.log('Error: ',response);
      });
    };
  })
  
  .controller('MessagesPage', function ($scope, $rootScope, appService) {
    appService.getUsers().then(function (data) {
      $scope.users = data.data;
    });
    
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
    
    $scope.sendMessage = function () {
      $scope.conversation.messages.push({
        date: '2016-12-03 11:45',
        author: $rootScope.me,
        text: $scope.message
      });
      $scope.message = '';
    };
      
  });