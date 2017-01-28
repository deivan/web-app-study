angular.module('app')
  .controller('mainPage', function ($scope, $rootScope,appService) {
    $rootScope.isShowLoading = false;

    $rootScope.getMate = function (authors) {
      if (authors[0] == $rootScope.me) {
        return authors[1];
      } else {
        return authors[0];
      }
    };
  })
  
  .controller('ProfilePage', function ($scope, $rootScope, appService) {
    
    $scope.message = '';
    
    $scope.updateProfile = function () {
      appService.updateProfile({
          avatar: $rootScope.profile.avatar,
          email: $rootScope.profile.email,
          origin: $rootScope.profile.origin
      }).then(function (response) {
        $scope.message = response;
      }, function (response) {
        console.log('Error: ',response);
      });
    };
    
    appService.getUser().then(function (response) {
      $rootScope.profile = response;
      $rootScope.me = $rootScope.profile.username;
    }, function (response) {
      console.log('Error: ',response);
    });
  })
  
  .controller('MessagesPage', function ($scope, $rootScope, appService, $location) {
    $scope.thisUser = '';
    $scope.firstMessage = '';
    appService.getUsers().then(function (data) {
      $scope.users = data.data;
    });
    appService.getConversations().then(function (data){
      $rootScope.conversations = data.data;
    });
    
    $scope.startConversation = function () {
      if ($scope.thisUser == '' || $scope.firstMessage == '') return;
      
      appService.startConversation({
        username: $scope.thisUser.username,
        message: $scope.firstMessage
      }).then(function (data) {
        console.log('start conv:', data.data);
        if (data.error) {
          console.log('ERROR: ', data.status);
        } else {
          $location.url('/messages/' + data.data._id + '/view');
        }
      });
    };
  })
  
  .controller('MessageViewPage', function ($scope, $rootScope, $routeParams, appService) {
    var id = $routeParams.id;
    $scope.conversation = {authors:[]}
    
    appService.getConversation(id).then(function (data) {
      $scope.conversation = data.data;
    });

    $scope.sendMessage = function () {
      appService.sendMessage(id, $scope.message).then(function (data) {
        if (!data.error){
          $scope.conversation.messages.push({ date: '', author: $rootScope.me, text: $scope.message });
          $scope.message = '';
        } else {
          
        }
      });
    };    
  })
  
  .controller('MinigamesPage', function ($scope) {
    
  })
  
  .controller('MinigamesLSPage', function ($scope, appService) {
    
    $scope.playDisabled = false;
    
    $scope.setStone = function (n) {
      if ($scope.stones[n] === undefined) {
        if ($scope.stones.selected < 3) {
          $scope.stones[n] = true;
          $scope.stones.selected++;
        }
      } else {
        delete $scope.stones[n];
        $scope.stones.selected--;
      }
    };
    
    $scope.playLuckyStones = function () {
      if ($scope.stones.selected === 3) {
        appService.playLuckyStones($scope.stones).then(function (data) {
          for (var key in data.data) {
            if (data.data[key] === 0) {
              $scope.wrongs[key] = 1;
            } else {
              $scope.wins[key] = 1;
            }
          }
          $scope.playDisabled = true;
        });
      }
    };
    
    $scope.clearGame = function () {
      $scope.stones = {
        selected: 0
      };
      $scope.wrongs = [0,0,0,0,0,0,0,0];
      $scope.wins = [0,0,0,0,0,0,0,0];
      $scope.playDisabled = false;
    };
    
    $scope.clearGame();
  })
  
  .controller('MinigamesCRPage', function ($scope, appService, $interval) {
    var interval;
    $scope.bugNumber = 1;
    $scope.bet = '1';
    $scope.bugsPosition = ['0px', '0px', '0px'];
    $scope.isShowResult = false;
    $scope.isYouWinner = false;
    $scope.isPlay = false;
    $scope.isShowError = false;
    $scope.message = '';
    
    $scope.playRace = function () {
      var result;
      $scope.playDisabled = true;
      $scope.isPlay = true;
      appService.playCrazyRace($scope.bugNumber, $scope.bet).then(function (data) {
        result = data;
        if (result.error) {
          $scope.isShowError = true;
          $scope.message = result.status;
          $scope.isPlay = false;
        } else {
          $scope.isShowError = false;
          $scope.message = '';
          $scope.results = result.data;
          playAnimation();
        }
      });
    };
    
    $scope.clearGame = function () {
      if ($scope.isPlay) return;
      $scope.isShowError = false;
      $scope.message = '';
      $scope.playDisabled = false;
      $scope.bugsPosition = ['0px', '0px', '0px'];
      $scope.isShowResult = false;
      $scope.results = null;
    };
    
    function playAnimation () {
      
      interval = $interval(function () {
        var coordinate;
        for (var i = 0; i < $scope.bugsPosition.length; i++) {
          coordinate = parseInt($scope.bugsPosition[i]);
          coordinate += $scope.results.speeds[i];
          $scope.bugsPosition[i] = coordinate + 'px';
          if (coordinate > 640) stopCrazyRace();
        }
      }, 50);
    }
    
    function stopCrazyRace () {
      $interval.cancel(interval);
      $scope.isYouWinner = ($scope.bugNumber === $scope.results.winner);
      $scope.isShowResult = true;
      $scope.isPlay = false;
    }
    
  })
  
  .controller('EquipmentPage', function ($scope) {
    $scope.market = [
      {
        title: 'Light Sonar',
        image: '',
        description: 'Not very might sonar',
        price: 20
      },
      {
        title: 'Might Light Sonar',
        image: '',
        description: 'A might sonar',
        price: 50
      }
    ];
  });