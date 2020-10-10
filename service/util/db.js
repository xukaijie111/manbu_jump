
let config = require('./config').config

let mongoose = require("mongoose");
// mongoose.connect('mongodb://'+config.DBHOST+'/'+config.DBNAME);
mongoose.connect(`mongodb://${config.DBUSERNAME}:${config.DBPWD}@127.0.0.1:27017/db_jc`, {auto_reconnect: true});
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
    open_id:{type:String},
    id:{type:String},
    userInfo:{type:Object}, //房间配置
    phone:{type:String},//进入房间的人
}, {timestamps: {createdAt: 'created', updatedAt: 'updated'}});


var userModel = mongoose.model('user',userSchema,'user');

module.exports = {
  userModel
}
