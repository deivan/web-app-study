var User = require('./models').User;
var Conv = require('./models').Conv;
var Goods = require('./models').Goods;
var UserGoods = require('./models').UserGoods;
var singleBattles = {};

exports.getUser = function (req, res) {
  if (req.session.user) {
    User.findOne({
      username: req.session.user.username
    }, function(err, user) {
        if (err) throw err;
        if (!user) {
          res.json({error: true, status: 'User not found.'});
        } else {
          res.json(user);
        }
    });  
  } else {
    res.sendFile(__dirname + '/public/error.html');
  }
};

exports.updateUser = function (req, res) {
  if (req.session.user) {
    User.findOneAndUpdate({
      username: req.session.user.username
    }, {
      avatar: req.body.avatar,
      email: req.body.email,
      origin: req.body.origin
    },
    { upsert: true, new: true },
    function(err, user) {
      if (!err) {
        res.json({error: false, status: 'Profile updated successfully.'});
      } else {
        res.json({error: true, status: "Can't update profile data"});
      }
    }); 
  } else {
    res.sendFile(__dirname + '/public/error.html');
  }
};

exports.getUsers = function (req, res) {
  if (req.session.user) {
    User.find({}, 
    function(err, users) {
      var names = [];
      if (!err) {
        for (var i = 0; i < users.length; i++)
          names.push({username: users[i].username});
        res.json({error: false, status: 'Got usernames', data: names});
      } else {
        res.json({error: true, status: "Can't get userlist"});
      }
    }); 
  } else {
    res.sendFile(__dirname + '/public/error.html');
  }
};

exports.getConversations = function (req, res) {
  if (req.session.user) {
    Conv.find({ authors: { $in: [ req.session.user.username ] } }, 
    function(err, conversations) {
      if (!err) {
        res.json({error: false, status: 'Got conversations', data: conversations});
      } else {
        res.json({error: true, status: "Can't get userlist"});
      }
    }); 
  } else {
    res.sendFile(__dirname + '/public/error.html');
  }
};

exports.newConversation = function (req, res) {
  var convUser = req.body.username, message = req.body.message, thatUser;
  if (req.session.user) {
    thatUser = req.session.user.username;
    Conv.find({ authors: { $all: [ convUser, thatUser ] } }, 
    function(err, conversations) {
      if (!err) {
        if (conversations.length === 0) {
          var conv = new Conv({
            authors:[thatUser, convUser],
            messages: [{date: getNewDateString(), author: thatUser, text: message}]
          });
          conv.save();
          res.json({error: false, status: "Conversation with user " + convUser + " was started", data: conv});          
        } else {
          Conv.findOneAndUpdate({authors: { $all: [ convUser, thatUser ]}}, {
            $push : {messages: {date: getNewDateString(), author: thatUser, text: message} }
          }, { safe: true, upsert: true},
          function (err, model) {
              console.log('error', err);
          });
          res.json({error: false, status: "Conversation with user " + convUser + " is exists", data: conversations[0]});          
        }
      } else {
        res.json({error: true, status: "Conversation with user " + convUser + " failed"});
      }
    }); 
  } else {
    res.sendFile(__dirname + '/public/error.html');
  }
};

exports.getConversation = function (req, res) {
  var _id = req.params.id, thatUser;
  if (req.session.user) {
    thatUser = req.session.user.username;
    Conv.findOne({ _id: _id }, 
    function(err, conversation) {
      if (!err) {
        res.json({error: false, status: 'Got conversation with ' + _id, data: conversation});
      } else {
        res.json({error: true, status: "Can't get conversation for " + _id});
      }
    }); 
  } else {
    res.sendFile(__dirname + '/public/error.html');
  }
};

exports.sendConversation = function (req, res) {
  var _id = req.params.id, 
      text = req.body.text, 
      thatUser;
  if (req.session.user) {
    thatUser = req.session.user.username;
      Conv.findOneAndUpdate({ _id: _id }, {
        $push : {messages: {date: getNewDateString(), author: thatUser, text: text} }
      }, { safe: true, upsert: true},
      function (err, result) {
        if (err) {
          console.log('error', err);
          res.json({error: true, status: "Error when adding message at conversation " + _id, data: err });            
        } else {
          res.json({error: false, status: "Added message to conversation " + _id, data: result });            
        }
      });
  } else {
    res.sendFile(__dirname + '/public/error.html');
  }
};

exports.playLuckyStones = function (req, res) {
  if (req.session.user) {
    var stones = req.body.stones, data = getLuckyStones(), results = {}, cash = 0;
    console.log('Lucky Stones random numbers: ', data)
    for (var key in stones) {
      if (key !== 'selected') {
        if (key == data[0] || key == data[1] ) {
          results[key] = 1;
          cash++;
        } else {
          results[key] = 0;
        }
      }
    }
    if (cash > 0) {
      User.findOne({ username: req.session.user.username}, function (err, user) {
        if (err) {
          console.log('mongodb error', err);
        } else {
          updateCash(req.session.user.username, user.cash + cash);
        }
      });
    }
    res.json({ error: false, status: "Game started", data: results });
  } else {
    res.sendFile(__dirname + '/public/error.html');
  }
};

exports.playCrazyRace = function (req, res) {
  var bug = 1 * req.body.bug, bet = 1 * req.body.bet, result;
  if (req.session.user) {
    User.findOne({ username: req.session.user.username}, function (err, user) {
      if (err) {
        console.log('mongodb error', err);
      } else {
        if (bet <= user.cash) {
          result = getCrazyRaces();
          if (result.winner === bug) {
            updateCash(req.session.user.username, user.cash + bet);
          } else {
            updateCash(req.session.user.username, user.cash - bet);
          }
          res.json({error: false, status: "Game completed", data: result });
        } else {
          res.json({error: true, status: "Your bet is more then your cash!", data: {} });
        }
      }
    });      
  } else {
    res.sendFile(__dirname + '/public/error.html');
  }
};

exports.getGoods = function (req, res) {
   if (req.session.user) {
    Goods.find({}, function (err, goods) {
      if (err) {
        console.log('mongodb error', err);
      } else {
        res.json({error: false, status: "All goods from market", data: goods });
      }
    });      
  } else {
    res.sendFile(__dirname + '/public/error.html');
  }
};

exports.getUserGoods = function (req, res) {
  var pocket ={};
   if (req.session.user) {
    UserGoods.find({ username: req.session.user.username}, function (err, userGoods) {
      if (err) {
        console.log('mongodb error', err);
      } else {
        res.json({error: false, status: "All goods from user", data: userGoods });
      }
    });      
  } else {
    res.sendFile(__dirname + '/public/error.html');
  }
};

exports.buyGood = function (req, res) {
  var id = 1 * req.params.id;
  if (req.session.user) {
    Goods.findOne({ id:id }, function (err, good) {
      if (err) {
        console.log('mongodb error', err);
      } else {
        User.findOne({ username: req.session.user.username}, function (err, user) {
          if (err) {
            console.log('mongodb error', err);
          } else {
            if (user.cash >= good.price) {
              var userGood;
              user.cash -= good.price;
              user.save();
              UserGoods.create({
                username: req.session.user.username,
                id: good.id,
                type: good.type,
                title: good.title,
                image: good.image,
                description: good.description,
                power: good.power,
                price: good.price,
                time: good.time,
                weared: false
              }, function (err, userGood) {
                if (err) {
                  console.log('mongodb error', err);
                } else {
                  res.json({error: false, status: "Item bought", data: userGood });
                }
              });
              
            } else {
              res.json({error: true, status: "You have no money to this item", data: {} });
            }
          }
        });
      }
    });    
  } else {
    res.sendFile(__dirname + '/public/error.html');
  }
};

exports.wearGood = function (req, res) {
  var id = 1 * req.params.id, weared = req.body.weared;
    if (req.session.user) {
      UserGoods.findOneAndUpdate({ username: req.session.user.username, 'id': id },
        { weared: weared }, { upsert: true },
        function (err, result) {
          if (err) {
            console.log('mongodb error', err);
          } else {
            res.json({error: false, status: "Item " + id + " weared:" + weared, data: result });
          }
        });
   }
 };
 
 exports.startBattle = function (req, res) {
   if (req.session.user) {
     if (singleBattles[req.session.user.username] !== undefined) {
       res.json({error: true, status: "Battle exist", data: {} });
     } else {
       singleBattles[req.session.user.username] = {
         healthPlayer: 20,
         healthEnemy:20,
         hitPlayer: 5,
         hitEnemy: 5,
         timeout: 30
       };
       res.json({error: false, status: "Battle started", data: { timeout: singleBattles[req.session.user.username].timeout } });
     }
   } else {
     res.sendFile(__dirname + '/public/error.html');
   }
 };
 
 exports.turnBattle = function (req, res) {
   if (req.session.user) {
      var selectedStrike = req.body.selectedStrike *1,
          selectedShield = req.body.selectedShield *1,
          enemyStrike = Math.round(Math.random()*2 + 1),
          enemyShield = Math.round(Math.random()*2 + 1),
          status, username = req.session.user.username, data;
      if (selectedStrike === enemyShield) {
        singleBattles[username].healthEnemy--;
      } else {
        singleBattles[username].healthEnemy -= 5;
      }
      if (selectedShield === enemyStrike) {
        singleBattles[username].healthPlayer--;
      } else {
        singleBattles[username].healthPlayer -= 5;
      }
      status = (singleBattles[username].healthEnemy <= 0 
             || singleBattles[username].healthPlayer <= 0) 
              ? 'finish' 
              : 'next';
      data = {
        enemyStrike:  enemyStrike,
        enemyShield:  enemyShield,
        healthEnemy:  singleBattles[username].healthEnemy  < 0 ? 0 : singleBattles[username].healthEnemy, 
        healthPlayer: singleBattles[username].healthPlayer < 0 ? 0 : singleBattles[username].healthPlayer,
        timeout: 30
      }; 
      res.json({
        error: false, status: status, 
        data: data
      });
      console.log('+ ' +username + ' made turn: ', data, status);
      if (status === 'finish') {
        User.findOne({ username: username}, function (err, user) {
          if (err) {
            console.log('mongodb error', err);
          } else {
            if (singleBattles[username].healthEnemy === 0 && singleBattles[username].healthPlayer === 0) {
              // a draw
              user.stat.draws++;
              endBattle(user, username);
            } else {
              if (singleBattles[username].healthEnemy === 0) {
                // user wins
                user.stat.wins++;
                endBattle(user, username);
              } else {
                // user fails
                user.stat.looses++;
                endBattle(user, username);
              }
            }
          }
        });
      }
   } else {
     res.sendFile(__dirname + '/public/error.html');
   }
 };
 
 // helpers
function getNewDateString () {
  var t = new Date();
  return t.getFullYear() + '-' + (1 + t.getMonth()) + '-' + t.getDate() + ' ' + t.getHours() + ':' + t.getMinutes();
}

function getLuckyStones () {
  var a1, a2, repeat = true;
  while (repeat) {
    a1 = Math.round(Math.random()*6) +1;
    a2 = Math.round(Math.random()*6) +1;
    if (a1 !== a2) repeat = false;
  }
  return [a1, a2];
}

function getCrazyRaces () {
  var a = [], repeat = true, winner = 0;
  while (repeat) {
    a[0] = Math.round(Math.random()*9) +1;
    a[1] = Math.round(Math.random()*9) +1;
    a[2] = Math.round(Math.random()*9) +1;
    winner = Math.max.apply(null, a);
    if (a[0] !== a[1] && a[0] !== a[2] && a[1] !== a[2]) repeat = false;
  }
  return {
    winner: 1 + a.indexOf(winner),
    speeds: a
  };
}

function updateCash (username, newCash) {
  User.findOneAndUpdate({
    username: username
  }, {
    cash: newCash
  },
  { upsert: true, new: true },
  function(err, user) {
    if (err) {
      console.log('! for user ' + username + ' cash cannot increase');
    } else {
      console.log('+ for user ' + username + ' cash increased to ' + newCash);
    }
  });
}

function endBattle (user,username) {
  user.save();
  delete singleBattles[username];
}