var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://student:student@ds061807.mlab.com:61807/mongo-deivan');

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
    time:  { type: Number, default: 1 }
});

var schemaUserGoods = new Schema({
  username: {
    type: String
  },
  id: {
    type: Number
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
var UserGoods = mongoose.model('UserGoods', schemaUserGoods);

module.exports = {
  User: User,
  Conv: Conv,
  Goods: Goods,
  UserGoods: UserGoods
};