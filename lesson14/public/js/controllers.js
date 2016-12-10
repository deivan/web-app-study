angular.module('app')
  .controller('mainPage', function ($scope, $rootScope,appService) {
    appService.getUser().then(function (response) {
      $rootScope.profile = response;
      $rootScope.me = $rootScope.profile.username;
    }, function (response) {
      console.log('Error: ',response);
    });

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
  
  .controller('MessagesPage', function ($scope, $rootScope, appService, $location) {
    $scope.thisUser = '';
    $scope.firstMessage = '';
    appService.getUsers().then(function (data) {
      $scope.users = data.data;
    });
    appService.getConversations().then(function (data){
      $rootScope.conversations = data.data;
    });
    
    $scope.startConversation = function () {
      if ($scope.thisUser == '' || $scope.firstMessage == '') return;
      
      appService.startConversation({
        username: $scope.thisUser.username,
        message: $scope.firstMessage
      }).then(function (data) {
        console.log('start conv:', data.data);
        if (data.error) {
          console.log('ERROR: ', data.status);
        } else {
          $location.url('/messages/' + data.data._id + '/view');
        }
      });
    };
  })
  
  .controller('MessageViewPage', function ($scope, $rootScope, $routeParams, appService) {
    var id = $routeParams.id;
    $scope.conversation = {authors:[]}
    
    appService.getConversation(id).then(function (data) {
      $scope.conversation = data.data;
    });

    $scope.sendMessage = function () {

      $scope.message = '';
    };
      
  });