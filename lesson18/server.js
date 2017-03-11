var express = require('express');
var app = express();
var bodyParser  = require('body-parser');
var session = require('express-session');
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schemaUser = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  status: { type: Number, default: 1 },
  email: {
    type: String,
    default: ''
  },
  level: { type: Number, default: 1 },
  goods: Array,
  cash:  { type: Number, default: 10 },
  origin: String,
  avatar: String,
  stat: {
    wins:  { type: Number, default: 0 },
    looses:{ type: Number, default: 0 },
    draws: { type: Number, default: 0 }
  },
  state: { type: Number, default: 0 }
});

var schemaConversation = new Schema({
  authors: {
    type: Array,
    required: true
  },
  messages: {
    type: Array
  }
});

var schemaGoods = new Schema({
    id: {
      type: Number,
      unique: true,
      required: true
    },
    type: {
      type: String
    },
    title: {
      type: String
    },
    image: {
      type: String
    },
    description: {
      type: String
    },
    power: { type: Number, default: 1 },
    price: { type: Number, default: 1 },
    time:  { type: Number, default: 1 },
    weared:{ type: Boolean, default: false }
});

var User = mongoose.model('User', schemaUser);
var Conv = mongoose.model('Conv', schemaConversation);
var Goods = mongoose.model('Goods', schemaGoods);

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://student:student@ds061807.mlab.com:61807/mongo-deivan');

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/public');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ 
  secret: 'ababagalamaga',
  resave: false,
  saveUninitialized: true
}));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/news', function (req, res) {
    res.sendFile(__dirname + '/public/news.html');
});

app.get('/about', function (req, res) {
    res.sendFile(__dirname + '/public/about.html');
});

app.get('/contact', function (req, res) {
    res.sendFile(__dirname + '/public/contacts.html');
});

app.get('/signup', function (req, res) {
    res.sendFile(__dirname + '/public/signup.html');
});

app.get('/game', function (req, res) {
    if (req.session.user) {
      res.sendFile(__dirname + '/public/game.html');
    } else {
      res.sendFile(__dirname + '/public/error.html');
    }
});

app.get('/logout', function (req, res) {
  delete req.session.user;
  res.redirect('/');
});

app.get('/login', function (req, res) {
  res.redirect('/');
});

app.post('/login', function (req, res) {
  User.findOne({
    username: req.body.username
  }, function(err, user) {
      if (err) throw err;
      if (!user) {
        res.sendFile(__dirname + '/public/error.html');
      } else {
        console.log('user:', user)
        if (user.password != req.body.password) {
          res.sendFile(__dirname + '/public/error.html');
        } else {
          req.session.user = user;
          res.redirect('/game');
        }
      }
  });
});

app.post('/signup', function (req, res) {
  console.log('body:', req.body);
  var user;
    User.findOne({
      username: req.body.username
    }, function(err, user) {
        if (err) throw err;
        if (user) {
          res.render('signup', { error: {username: true}, success: false });
        } else {
          User.findOne({
            email: req.body.email
          }, function(err, user) {
              if (err) throw err;
              if (user) {
                res.render('signup', { error: {email: true}, success: false });
              } else {
                if (req.body.password.trim() == '') {
                  res.render('signup', { error: {password: true}, success: false });
                } else {
                  user = new User({
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    avatar: req.body.avatar,
                    origin: req.body.origin
                  });
                  user.save();
                  res.render('signup', { error: false, success: true });
                }
              }
          }); 
        }
    });  
});

// API methods

app.get('/api/user', function (req, res) {
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
});

app.post('/api/user', function (req, res) {
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
});

app.get('/api/users', function (req, res) {
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
});

app.get('/api/conversations', function (req, res) {
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
});

app.post('/api/conversations', function (req, res) {
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
});

app.get('/api/conversation/:id', function (req, res) {
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
});

app.post('/api/conversation/:id', function (req, res) {
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
});

app.post('/api/luckystones', function (req, res) {
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
});

app.post('/api/crazyrace', function (req, res) {
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
});

app.get('/api/goods', function (req, res) {
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
});

app.get('/api/goods/user', function (req, res) {
  var pocket ={};
   if (req.session.user) {
    User.findOne({ username: req.session.user.username}, function (err, user) {
      if (err) {
        console.log('mongodb error', err);
      } else {
        for (var i = 0; i < user.goods.length; i++)
          pocket[user.goods[i].id] = user.goods[i];
        res.json({error: false, status: "All goods from user", data: pocket });
      }
    });      
  } else {
    res.sendFile(__dirname + '/public/error.html');
  }
});

app.post('/api/goods/user/:id/wear', function (req, res) {
  var id = 1 * req.params.id, weared = req.body.weared;
    if (req.session.user) {
      User.findOneAndUpdate({ username: req.session.user.username, 'goods.id': id },
        {'$set': { 'goods.$.weared': weared }}, { upsert: true },
        function (err, result) {
          if (err) {
            console.log('mongodb error', err);
          } else {
            res.json({error: false, status: "Item " + id + " weared:" + weared, data: result });
          }
        });
   }
 });
 
 app.post('/api/single-battle/start', function (req, res) {
   if (req.session.user) {
     if (singleBattles[req.session.user.username] !== undefined) {
       res.json({error: true, status: "Battle exist", data: {} });
     } else {
       singleBattles[req.session.user.username] = {
         healthPlayer: 20,
         healthEnemy:20,
         hitPlayer: 5,
         hitEnemy: 5,
         timeout: null
       };
       res.json({error: false, status: "Battle started", data: {} });
     }
   } else {
     res.sendFile(__dirname + '/public/error.html');
   }
 });
 
 app.post('/api/single-battle/turn', function (req, res) {
   if (req.session.user) {
      var selectedStrike = req.body.selectedStrike *1,
          selectedShield = req.body.selectedShield *1;
      var enemyStrike = Math.round(Math.random()*3 + 1),
          enemyShield = Math.round(Math.random()*3 + 1);
      if (selectedStrike === enemyShield) {
        singleBattles[req.session.user.username].healthEnemy--;
      } else {
        singleBattles[req.session.user.username].healthEnemy =- 5;
      }
      if (selectedShield === enemyStrike) {
        singleBattles[req.session.user.username].healthPlayer--;
      } else {
        singleBattles[req.session.user.username].healthPlayer =- 5;
      }
      res.json({error: false, status: "Turh done", data: {
          healthEnemy: singleBattles[req.session.user.username].healthEnemy, 
          healthPlayer: singleBattles[req.session.user.username].healthPlayer} 
      });
   } else {
     res.sendFile(__dirname + '/public/error.html');
   }
 });
 
 var singleBattles = {};

app.listen(port);
console.log('Web-app was started at port ' + port);

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