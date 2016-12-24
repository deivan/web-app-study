angular.module('app')
  .service('appService', function ($http, $q, $rootScope) {
    return ({
       getUser: getUser,
       updateProfile: updateProfile,
       
       getUsers: getUsers,
       
       getConversations: getConversations,
       startConversation: startConversation,
       getConversation: getConversation,
       sendMessage: sendMessage,
       
       playLuckyStones: playLuckyStones
    });

    function getUser () {
      $rootScope.isShowLoading = true;
       var request = $http({
           method: 'get',
           url: '/api/user',
           data: {}
       });
       return (request.then( handleSuccess, handleError ));
    }
    
    function updateProfile (data) {
      $rootScope.isShowLoading = true;
      var request = $http({
        method: 'post',
        url: '/api/user',
        data: data
      });
      return (request.then( handleSuccess, handleError ));
    }

    function getUsers () {
      $rootScope.isShowLoading = true;
      var request = $http({
        method: 'get',
        url: '/api/users',
        data: {}
      });
      return (request.then( handleSuccess, handleError ));
    }
    
    function getConversations () {
      $rootScope.isShowLoading = true;
      var request = $http({
        method: 'get',
        url: '/api/conversations',
        data: {}
      });
      return (request.then( handleSuccess, handleError ));
    }
    
    function startConversation (data) {
      $rootScope.isShowLoading = true;
      var request = $http({
        method: 'post',
        url: '/api/conversations',
        data: data
      });
      return (request.then( handleSuccess, handleError ));      
    }
    
    function getConversation (id) {
      $rootScope.isShowLoading = true;
      var request = $http({
        method: 'get',
        url: '/api/conversation/' + id,
        data: {}
      });
      return (request.then( handleSuccess, handleError ));
    }
    
    function sendMessage(id, text) {
      $rootScope.isShowLoading = true;
      var request = $http({
        method: 'post',
        url: '/api/conversation/' + id,
        data: {text: text}
      });
      return (request.then( handleSuccess, handleError ));      
    }
    
    function playLuckyStones (data) {
      $rootScope.isShowLoading = true;
      var request = $http({
        method: 'post',
        url: '/api/luckystones/',
        data: { stones: data }
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