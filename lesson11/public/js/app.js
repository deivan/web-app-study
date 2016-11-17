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
  })
  
  .controller('mainPage', function ($scope) {
    
  })
  
  .controller('ProfilePage', function ($scope, $http) {
    $scope.profile = {};
    $scope.message = '';
    
    $http({
      method: 'GET',
      url: '/api/user'
    }).then(function successCallback (response) {
        $scope.profile = response.data;
    }, function errorCallback (response) {
      console.log('Error: ',response);
    });
    
    $scope.updateProfile = function () {
      $http({
        method: 'POST',
        url: '/api/user',
        data: {
          avatar: $scope.profile.avatar,
          email: $scope.profile.email,
          origin: $scope.profile.origin
        }
      }).then(function successCallback (response) {
        $scope.message = response.data;
       }, function errorCallback (response) {
        console.log('Error: ',response);
      });
    };
  });