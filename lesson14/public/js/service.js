angular.module('app')
  .service('appService', function ($http, $q) {
    return ({
       getUser: getUser,
       updateProfile: updateProfile,
       
       getUsers: getUsers,
       
       getConversations: getConversations,
       startConversation: startConversation
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
        method: 'pos',
        url: '/api/conversations',
        data: { data }
      });
      return (request.then( handleSuccess, handleError ));      
    }
    
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