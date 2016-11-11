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
  .controller('ProfilePage', function ($scope) {
    $scope.profile = {};
  });