angular.module('appAdmin')
  .service('serviceAdmin', function ($http, $q, $rootScope) {
    return ({
      getStat: getStat,
      getUsers: getUsers,
      getGoods: getGoods
    });
    
    function getStat () {
      $rootScope.isShowLoading = true;
      var request = $http({
        method: 'get',
        url: '/api/admin/stat',
        data: {}
      });
      return (request.then( handleSuccess, handleError ));
    }
    
    function getUsers () {
      $rootScope.isShowLoading = true;
      var request = $http({
        method: 'get',
        url: '/api/admin/users',
        data: {}
      });
      return (request.then( handleSuccess, handleError ));
    }

    function getGoods () {
      $rootScope.isShowLoading = true;
      var request = $http({
        method: 'get',
        url: '/api/admin/goods',
        data: {}
      });
      return (request.then( handleSuccess, handleError ));
    }
    
    // response handlers 
    function handleSuccess (response) {
      $rootScope.isShowLoading = false;
         console.log('request result: ', response);
         return (response.data);
    }

    function handleError (response) {
      $rootScope.isShowLoading = false;
       console.log('ERROR result: ', response);
       if (
           ! angular.isObject( response.data ) ||
           ! response.data
           ) {
           return ($q.reject({ detail: response.status + ': ' + response.statusText }));
       }
       return ($q.reject(response.data));
    }
});