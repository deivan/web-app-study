var express = require('express');
var app = express();
var bodyParser  = require('body-parser');
var session = require('express-session');
var port = process.env.PORT || 3000;
var Api = require('./api-routes');
 
var User = require('./models').User;
var Conv = require('./models').Conv;
var Goods = require('./models').Goods;
var UserGoods = require('./models').UserGoods;

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
        if (user.status === 0) {
          res.render('banned', { time: user.banTime});
        } else {
          console.log('user:', user)
          if (user.password != req.body.password) {
            res.sendFile(__dirname + '/public/error.html');
          } else {
            user.lastLogin = new Date();
            user.lastLoginIP = req.ip;
            user.lastLoginUA = req.headers['user-agent'];
            user.save();
            req.session.user = user;
            res.redirect('/game');
          }
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

app.get('/admin', function (req, res) {
  if (!!req.session && !!req.session.admin) {
    res.sendFile(__dirname + '/public/admin_zone.html');
  } else {
    res.render('admin_login', { error: false });
  }
});

app.post('/admin', function (req, res) {
  User.findOne({
    username: req.body.username, password: req.body.password, status:2
  }, function(err, user) {
    if (err) throw err;
    if (!user) {
      res.render('admin_login', { error: true});
    } else {
      req.session.user = user;
      req.session.admin = true;
      res.sendFile(__dirname + '/public/admin_zone.html');
    }
  });
});

// API methods

app.get( '/api/user', Api.getUser);
app.post('/api/user', Api.updateUser);
app.get('/api/users', Api.getUsers);

app.get( '/api/conversations', Api.getConversations);
app.post('/api/conversations', Api.newConversation);
app.get( '/api/conversation/:id', Api.getConversation);
app.post('/api/conversation/:id', Api.sendConversation);

app.post('/api/luckystones', Api.playLuckyStones);
app.post('/api/crazyrace', Api.playCrazyRace);

app.get( '/api/goods', Api.getGoods);
app.get( '/api/goods/user', Api.getUserGoods);
app.post('/api/goods/user/:id/buy', Api.buyGood);
app.post('/api/goods/user/:id/wear', Api.wearGood);
 
 app.post('/api/single-battle/start', Api.startBattle);
 app.post('/api/single-battle/turn', Api.turnBattle);
 
 // admin'sAPI
 
 app.get('/api/admin/stat', Api.adminStat);
 app.get('/api/admin/users', Api.adminUsers);
 app.get('/api/admin/goods', Api.getGoods);
 app.post('/api/admin/ban', Api.adminBan);

app.listen(port);
console.log('Web-app was started at port ' + port);
