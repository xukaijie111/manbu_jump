
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
    startTime:{type:String},
    endTime:{type:String},
    count:{type:Number},
    gameId:{type:Number}, // gameId
    ka:{type:Number}, // 卡路里
    deviceId:{type:String},// 设备deviceId
    userId:{type:String}
}, {timestamps: {createdAt: 'created', updatedAt: 'updated'}});


var gameModel = mongoose.model('game',gameSchema,'game');

module.exports = {
  userModel,
  deviceModel,
  gameModel
}
