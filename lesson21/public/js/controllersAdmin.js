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
  
  .controller('AdminBanPage', function ($scope, serviceAdmin) {
    $scope.users = [];
    $scope.user = '';
    $scope.time = '';
    $scope.reason = '';
    $scope.result = '';
    
    getUsers();
    
    $scope.updateUser = function (user) {
      if (user !== null) {
        $scope.time = new Date (user.banTime);
        $scope.reason = user.banReason;
        $scope.result = '';
      }

    };
    
    $scope.changeBan = function () {
      serviceAdmin.ban($scope.user.username, $scope.time, $scope.reason).then(function (data) {
        getUsers();
        $scope.result = 'Done.';
      });
    };
    
    function getUsers () {
      serviceAdmin.getUsers().then(function (data) {
        $scope.users = data.data;
        if (data.data.length !== 0) $scope.user = data.data[0].username;
      });
    }
  });