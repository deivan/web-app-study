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
    $http({
      method: 'GET',
      url: '/api/profile'
    }).then(function successCallback(response) {
      console.log('1',response)
        $scope.profile = response.data;
    }, function errorCallback(response) {
      console.log('Error: ',response);
    });
  });