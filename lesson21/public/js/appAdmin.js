angular.module('appAdmin',['ngRoute'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl : '/admin-stat.html',
        controller: 'AdminStatPage'
      })
      .when('/users', {
        templateUrl : '/admin-users.html',
        controller: 'AdminUsersPage'
      })
      .when('/goods', {
        templateUrl : '/admin-goods.html',
        controller: 'AdminGoodsPage'
      })
      .when('/ban', {
        templateUrl : '/admin-ban.html',
        controller: 'AdminBanPage'
      });
  })
  
  .run(function ($rootScope) {
    $rootScope.isShowLoading = false;
  });