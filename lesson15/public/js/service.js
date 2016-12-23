angular.module('app')
  .service('appService', function ($http, $q) {
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
       var request = $http({
           method: 'get',
           url: '/api/user',
           data: {}
       });
       return (request.then( handleSuccess, handleError ));
    }
    
    function updateProfile (data) {
      var request = $http({
        method: 'post',
        url: '/api/user',
        data: data
      });
      return (request.then( handleSuccess, handleError ));
    }

    function getUsers () {
      var request = $http({
        method: 'get',
        url: '/api/users',
        data: {}
      });
      return (request.then( handleSuccess, handleError ));
    }
    
    function getConversations () {
      var request = $http({
        method: 'get',
        url: '/api/conversations',
        data: {}
      });
      return (request.then( handleSuccess, handleError ));
    }
    
    function startConversation (data) {
      var request = $http({
        method: 'post',
        url: '/api/conversations',
        data: data
      });
      return (request.then( handleSuccess, handleError ));      
    }
    
    function getConversation (id) {
      var request = $http({
        method: 'get',
        url: '/api/conversation/' + id,
        data: {}
      });
      return (request.then( handleSuccess, handleError ));
    }
    
    function sendMessage(id, text) {
      var request = $http({
        method: 'post',
        url: '/api/conversation/' + id,
        data: {text: text}
      });
      return (request.then( handleSuccess, handleError ));      
    }
    
    function playLuckyStones (data) {
      return { 1:0, 2:0, 7:1 };
    }
    
    // response handlers
    function handleSuccess (response) {
         console.log('request result: ', response);
         return (response.data);
    }

    function handleError (response) {
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