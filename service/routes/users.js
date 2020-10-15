var express = require('express');
var router = express.Router();

var axios = require('axios');

var Util = require('../util/util')

import {
  userModel, deviceModel 
} from '../db/db'

var creatingUser = {};

function createUser(openId,res){
  var userId = Util.generateUserId();
  if (creatingUser[userId]){
      createUser(openId)
      return;
  }
  creatingUser[userId] = true;

  userModel.findOne({userId:userId})
  .select("-_id")
  .exec((err,ret)=> {
      if (err){
          res.json({code:-2,message:'读取数据库错误'})
          delete creatingUser[userId]
          return
      }

      if (ret && ret.length){
          delete creatingUser[userId];
          createUser(openId)
          return
      }

      var condition = {
          userId,
          openId,
      }
      userModel.create(condition,  (err, doc) => {
          if (err) {
              delete creatingUser[userId]
              res.json({code:-2,message:"插入数据错误"});
          } else {
              delete creatingUser[userId]
              res.json({code:0,data:{
                openId,
                userId,
              }})
          }
      })

  })


}

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login',async (req,res,next)=>{
  const body = req.body;
  const code = body.code;
  try{
    const url=`https://api.weixin.qq.com/sns/jscode2session?appid=wx03eb0a8135422d08&secret=fbf1ce432034eae95a9a57ddd24d88c8&js_code=${code}&grant_type=authorization_code`
    const ret = await axios.get(url);
    console.log('####res is ',ret,typeof ret)
    const data = ret.data;
    const session_key = data.session_key;
    const open_id = data.open_id;
    userModel.findOne({openId:open_id})
    .select("-_id")
    .exec((err,value)=>{
      if (value) {
        return res.json({code:0,data:value})
      }else{
        return createUser(open_id,res)
      }
    })
  
  }catch(err) {
    console.log(err);
  }

})

router.post('/save_info',(req,res,next)=>{
  var body = req.body;
  if (!body.userInfo || !body.userId) {
    return res.json({code:-1,message:'参数错误'})
  }

  userModel.updateOne({userId:body.userId},{userInfo:body.userInfo})
  res.json({code:0})
})

router.post('/bind_device',(req,res,next)=>{
    var body = req.body;
    var id = body.id;

    var userId = body.userId;
    if (!id || !userId) {
      return res.json({code:-1,message:'参数错误'})
    }

    deviceModel.findOne({id},(err,value)=>{
        if (value && !value.isDelete && value.userId) {
          return res.json({code:-1,message:'该设备已经绑定'})
        }

        deviceModel.updateOne({id},{userId,isDelete:false},(err)=>{
          if (err) {
            return res.json({err:-1,message:'数据库错误'})
          }

          res.json({code:0})
        })
    })
})

router.post('/unbind_device',(req,res,next)=>{
    var body = req.body;
    var id = body.id;

    var userId = body.userId;
    if (!id || !userId) {
      return res.json({code:-1,message:'参数错误'})
    }
    deviceModel.findOne({id},(err,value) => {
      if (err) {
        return res.json({err:-1,message:'数据库错误'})
      }

      deviceModel.updateOne({id},{isDelete:true},(err)=>{
        if (err) {
          return res.json({err:-1,message:'数据库错误'})
        }
        res.json({code:0})
      })

    })
})


module.exports = router;
