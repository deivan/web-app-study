angular.module('appAdmin')
  .controller('main', function ($scope) {
          
  })
  .controller('AdminStatPage', function ($scope, serviceAdmin) {
    $scope.stat = {};
    serviceAdmin.getStat().then(function(data){
      $scope.stat = data.data;
    });
  })
  
  .controller('AdminUsersPage', function ($scope, serviceAdmin) {
    $scope.users = [];
    $scope.statuses = ['banned','','admin'];
    serviceAdmin.getUsers().then(function (data) {
      $scope.users = data.data;
    });
  })
  
  .controller('AdminGoodsPage', function ($scope, serviceAdmin) {
    $scope.goods = [];
    serviceAdmin.getGoods().then(function (data) {
      $scope.goods = data.data;
    });
  })
  
  .controller('AdminBanPage', function ($scope) {
    
  });