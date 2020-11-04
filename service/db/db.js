
let config = require('../config').config

let mongoose = require("mongoose");
// mongoose.connect('mongodb://'+config.DBHOST+'/'+config.DBNAME);
var url = `mongodb://${config.DBUSERNAME}:${config.DBPWD}@${config.DBHOST}:${config.DBPORT}/${config.DBNAME}`
console.log('###connect url is ',url)
mongoose.connect(url, {auto_reconnect: true});
var db = mongoose.connection;


db.on('error',()=>{
    console.log('数据库连接失败');
});

db.once('open',()=>{
    console.log('数据连接成功');
});

db.once('close',()=>{
    console.log('数据断开连接');
});

var Schema = mongoose.Schema;

var userSchema = new Schema({
    openId:{type:String},//openid
    userId:{type:String},
    userInfo:{type:Object}
}, {timestamps: {createdAt: 'created', updatedAt: 'updated'}});

var userModel = mongoose.model('user',userSchema,'user');

var deviceSchema = new Schema({
  deviceId:{type:String},
  userId:{type:String}, //userid
  isDelete:{type:Boolean}, //是否解绑
}, {timestamps: {createdAt: 'created', updatedAt: 'updated'}});

var deviceModel = mongoose.model('device',deviceSchema,'device');


var gameSchema = new Schema({
    startTime:{type:Date},
    endTime:{type:Date},
    count:{
      type: Number,
      default: 0
  },
    gameId:{type:String}, // gameId
    ka:{
      type: Number,
      default: 0
  }, // 卡路里
    deviceId:{type:String},// 设备deviceId
    userId:{type:String}
}, {timestamps: {createdAt: 'created', updatedAt: 'updated'}});


var gameModel = mongoose.model('game',gameSchema,'game');

var pKSchema = new Schema({
  startTime:{type:Date},
  endTime:{type:Date},
  pkId:{type:String},
  ownerId:{type:String}, //创建者userId
  winerId:{type:String}, //获胜者
  maxMan:{
    type:Number,
    default:10
  },
  mode:{  //1时间 2计数跳
    type:Number,
    default:1
  },
  maxSeconds:{
    type:Number, //如果是时间跳，则使用到秒
  },
  maxCount:{
    type:Number,
    default:0 , // 计数跳 设置最大数量
  },
  userList:[{
      userId:{type:String},
      userInfo:{type:Object},
      count:{type:Number},
      deviceInfo:{type:Object},
  }],
  
}, {timestamps: {createdAt: 'created', updatedAt: 'updated'}});

var pkModel = mongoose.model('pk',pKSchema,'pk');

module.exports = {
  userModel,
  deviceModel,
  gameModel,
  pkModel
}
