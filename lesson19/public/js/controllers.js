angular.module('app')
  .controller('mainPage', function ($scope, $rootScope,appService) {
    $rootScope.isShowLoading = false;
    $scope.chatMessage = '';
    $scope.isChatClosed = true;
    $scope.messages = $rootScope.messages;

    $rootScope.getMate = function (authors) {
      if (authors[0] == $rootScope.me) {
        return authors[1];
      } else {
        return authors[0];
      }
    };
    
    $scope.sendMessage = function () {
      $rootScope.sendToSocket($scope.chatMessage);
      $scope.chatMessage = '';
    };
    
    $scope.typeMessage = function (e) {
      if (e.charCode === 13) $scope.sendMessage();
    };
    
    $scope.toggleChat = function () {
      $scope.isChatClosed = !$scope.isChatClosed;
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
  
  .controller('EquipmentPage', function ($scope, appService) {
    
    $scope.body = {
      gun: {},
      shield: {}
    };
    $scope.attack = 1;
    $scope.defence = 1;
    $scope.pocket = {};
    
    appService.getMarketGoods().then(function (data){
      $scope.market = data.data;
      return appService.getUserGoods();
    }).then(function (data) {
      preparePocket(data.data);
    });
    
    $scope.buyItem = function (item) {
      if($scope.pocket[item.id] !== undefined && $scope.pocket[item.id].weared === true) return;
      $scope.pocket[item.id] = item;
      $scope.pocket[item.id].weared = false;
    };
    
    $scope.wearItem = function (item) {
      appService.wearGood({
        id: item.id,
        weared: true
      }).then(function (data) {
        if ($scope.body[item.type].id === undefined) {
          $scope.body[item.type] = {
            id: item.id,
            image: item.image
          };
          $scope.pocket[item.id].weared = true;
          if (item.type === 'gun') {
            $scope.attack = 1 + item.power;
          } else {
            $scope.defence = 1 + item.power;
          }
        }
      });
    };
    
    $scope.unwear = function (key) {
      if ($scope.body[key].id === undefined) return;
      appService.wearGood({
        id: $scope.body[key].id,
        weared: false
      }).then(function (data) {
        $scope.pocket[$scope.body[key].id].weared = false;
        $scope.body[key]= {};
        if (key === 'gun') {
          $scope.attack = 1;
        } else {
          $scope.defence = 1;
        }
      });
    };
    
    function preparePocket (data) {
      for (var key in data) {
        var current = data[key];
        for (var i = 0; i < $scope.market.length; i++) {
          var m = $scope.market[i];
          if (m.id == key) {
            $scope.pocket[key] = {
              id: key,
              description: m.description,
              image: m.image,
              power: m.power,
              price: m.price,
              title: m.title,
              type: m.type,
              time: current.time,
              weared: current.weared
            };
            if (current.weared) {
              $scope.body[m.type] = {
                id: m.id,
                image: m.image
              };
            }
          }
        }
      }
    }
  })
  
  .controller('SingleBattle', function ($scope, $timeout, appService, $rootScope, $route) {
    $scope.tab = 1;
    $scope.overlay = true;
    $scope.healthPlayer = 20;
    $scope.healthEnemy = 20;
    $scope.maxHealth = 20;
    $scope.turnTime = 30;
    $scope.selectedShield = null;
    $scope.selectedStrike = null;
    $scope.playerStyle = {};
    $scope.enemyStyle = {};
    $scope.enemyStrikeShow = false;
    $scope.enemyShieldShow = false;
    $scope.enemyStrikeStyle = {};
    $scope.enemyShieldStyle = {};
    $scope.strikeStyles = [ null,
      { top: '10px', left: '20px' },
      { top: '110px', left: '15px' },
      { top: '110px', left: '100px' }
    ];
    $scope.shieldStyles = [ null,
      { top: '15px', left: '110px' },
      { top: '115px', left: '110px' },
      { top: '115px', left: '30px' }
    ];
    $scope.playerMoving = { top: '70px' };
    $scope.enemyMoving =  { top: '70px' };
       
    $scope.startGame = function (tab) {
      appService.startSingleBattle().then(function (data) {
        $scope.overlay = false;
        $scope.battleTimer = $timeout(countDown, 1000);
        $scope.$on("$locationChangeStart", function(event){
          event.preventDefault();
        });
      }).catch(function (data) {
        
      });
    };
    
    $scope.makeTurn = function () {
      if ($scope.selectedShield === null || $scope.selectedStrike === null) return;
      $timeout.cancel($scope.battleTimer);
      appService.turnSingleBattle({
        selectedShield: $scope.selectedShield,
        selectedStrike: $scope.selectedStrike
      }).then(function (data) {
        $scope.healthPlayer = data.data.healthPlayer;
        $scope.healthEnemy = data.data.healthEnemy;
        $scope.playerStyle = {width: ($scope.healthPlayer / $scope.maxHealth * 100) + '%'};
        $scope.enemyStyle = {width: ($scope.healthEnemy / $scope.maxHealth * 100) + '%'};
        $scope.selectedShield = null;
        $scope.selectedStrike = null;
        $scope.enemyStrikeShow = true;
        $scope.enemyShieldShow = true;
        $scope.enemyStrikeStyle = $scope.strikeStyles[data.data.enemyStrike];
        $scope.enemyShieldStyle = $scope.shieldStyles[data.data.enemyShield];
        $scope.playerMoving = { top: (Math.random()*60 + 40) + 'px' };
        $scope.enemyMoving =  { top: (Math.random()*60 + 40) + 'px' };
        
        if (data.status === 'finish') {
          $rootScope.finish.isShow = true;
          $scope.overlay = true;
          if ($scope.healthPlayer === 0 && $scope.healthEnemy === 0) {
            $rootScope.finish.prompt = 'The game was finished as draw. Not bad.';
          } else {
            if ($scope.healthPlayer !== 0) {
              $rootScope.finish.prompt = 'You are the Champion, my friend!';
            }
          }
        } else {
          setTimeout(function () {
            $scope.enemyStrikeShow = false;
            $scope.enemyShieldShow = false;
          }, 5000);
          $scope.turnTime = 30;
          $scope.battleTimer = $timeout(countDown, 1000); 
        }
      }).catch(function (data) {
        
      });
    };
    
    $scope.hideFinish = function () {
      $rootScope.finish.isShow = false;
      $route.reload();
    };
    
    $scope.hitPlayer = function (zone) {
      $scope.selectedShield = zone;
    };
    
    $scope.hitEnemy = function (zone) {
      $scope.selectedStrike = zone;
    };
    
    function countDown () {
      $scope.turnTime--;
      if ($scope.turnTime > 0) {
        $scope.battleTimer = $timeout(countDown, 1000);
      } else {
        $timeout.cancel($scope.battleTimer);
        if ($scope.selectedShield === null) $scope.selectedShield = 2;
        if ($scope.selectedStrike === null) $scope.selectedStrike = 2;
        $scope.makeTurn();
      }
    }
  })
  
  .controller('SingleBattleDuel', function ($scope, $timeout, appService, $rootScope, $route) {
  
  });