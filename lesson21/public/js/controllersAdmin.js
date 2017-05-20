angular.module('appAdmin')
  .controller('main', function ($scope) {
          
  })
  .controller('AdminStatPage', function ($scope, serviceAdmin) {
    $scope.stat = {};
    serviceAdmin.getStat().then(function(data){
      $scope.stat = data.data;
    });
  })
  
  .controller('AdminUsersPage', function ($scope) {
    
  })
  
  .controller('AdminGoodsPage', function ($scope) {
    
  })
  
  .controller('AdminBanPage', function ($scope) {
    
  });