var express = require('express');
var router = express.Router();
var  {
  pkModel 
} = require('../db/db')

var PK = require('../util/pk')

var Util = require('../util/util');

var creatingPk = {};
var pkRoom = {};

function createPk(option,res){
  var pkId = Util.generatePkId();
  if (creatingPk[pkId]){
    createPk(option,res)
      return;
  }
  if (pkRoom[pkId]) {
    createPk(option,res)
      return;
  }
  creatingPk[pkId] = true;

  pkModel.findOne({pkId:pkId})
  .select("-_id")
  .exec((err,ret)=> {
      if (err){
          res.json({code:-2,message:'读取数据库错误'})
          delete creatingPk[pkId]
          return
      }

      if (ret && ret.length){
        delete creatingPk[pkId]
        createPk(option,res)
          return
      }

      var condition = {
          pkId:pkId,
          ...option
      }

      var onePk = new PK(condition)
      pkRoom[onePk.pkId] = onePk;
      return res.json({code:0,data:{
        pkId:onePk.pkId
      }})
      

  })


}

router.post('/create_pk',(req,res,next)=>{
  var body = req.body;
  var userId = body.userId;
  var mode = body.mode;
  var maxMan = body.maxMan;
  
  if (!userId || !mode || !maxMan) {
    return res.json({code:-1,message:'参数错误'})
  }
  if (mode === 1 && !body.maxSeconds) {
    return res.json({code:-1,message:'参数错误maxSeconds'})
  }

  if (mode === 2 && !body.maxCount) {
    return res.json({code:-1,message:'参数错误maxCount'})
  }

  return createPk(body,res)

})

router.post('/edit_pk',(req,res,next)=>{
  var body = req.body;
  var userId = body.userId;
  var pkId = body.pkId;
  var mode = body.mode;
  if (!userId || !mode) {
    return res.json({code:-1,message:'参数错误'})
  }

  if (mode === 1 && !body.maxSeconds) {
    return res.json({code:-1,message:'参数错误maxSeconds'})
  }

  if (mode === 2 && !body.maxCount) {
    return res.json({code:-1,message:'参数错误maxCount'})
  }

  var pkData = pkRoom[pkId];
  if (!pkData) {
    return res.json({code:-1,message:'未找到该竞技'})
  }

  pkData.editPk(body);
  res.json({code:0})

})

router.post('get_pk_detail',(req,res,next)=>{
  var body = req.body;
  var pkId = body.pkId;
  var userId = body.userId;

  if (!userId || !pkId) {
    return res.json({code:-1,message:'参数错误'})
  }

  var pkData = pkRoom[pkId];
  if (!pkData) {
    return res.json({code:-1,message:'未找到该竞技'})
  }

  return res.json({
    code:0,
    data:{
      mode:pkData.mode,
      startTime:pkData.startTime,
      userList:pkData.userList,
      maxMan:pkData.maxMan,
      maxSeconds:pkData.maxSeconds,
      maxCount:pkData.maxCount,
      ownerId:pkData.ownerId,
      winerId:pkData.winerId
    }
  })
})

router.post('/enter_pk',(req,res,next)=>{
  var body = req.body;
  var pkId = body.pkId;
  var userId = body.userId;
  var deviceInfo = body.deviceInfo;
  var userInfo = body.userInfo;
  if (!pkId || !userId || !deviceInfo || !userInfo) {
    return res.json({code:-1,messahe:'参数错误'})
  }

  var pkData = pkRoom[pkId];
  if (!pkData) {
    return res.json({code:-1,message:'未找到该竞技'})
  }

  let userList = pkData.userList;
  let userIds = userList.map((u)=>{return u.userId});
  const index = userIds.indexOf(userId);
  if (index === -1) {
    userList.push({
      userId,
      userInfo,
      count:0,
      deviceInfo
    })
  }else{
    userList[index].deviceInfo = deviceInfo;
  }

  return res.json({code:0})
})

router.post('/leave_pk',(req,res,next)=>{
  var body = req.body;
  var pkId = body.pkId;
  var userId = body.userId;
  if (!pkId || !userId) {
    return res.json({code:-1,messahe:'参数错误'})
  }

  var pkData = pkRoom[pkId];
  if (!pkData) {
    return res.json({code:-1,message:'未找到该竞技'})
  }

  let userList = pkData.userList;
  let userIds = userList.map((u)=>{return u.userId});
  const index = userIds.indexOf(userId);
  if (index !== -1) {
    userList.splice(index,1)
  }

  return res.json({code:0})
})


router.post('/update_record',(req,res,next)=>{
  var body = req.body;
  var pkId = body.pkId;
  var userId = body.userId;
  var count = body.count;
  if (!pkId || !userId || !count) {
    return res.json({code:-1,messahe:'参数错误'})
  }

  var pkData = pkRoom[pkId];
  if (!pkData) {
    return res.json({code:-1,message:'未找到该竞技'})
  }

  let userList = pkData.userList;
  let userIds = userList.map((u)=>{return u.userId});
  const index = userIds.indexOf(userId);
  if (index !== -1 ) {
    userList[index].count = count
  }
  return res.json({code:0})
})

router.post('/end_pk',(req,res,next)=>{

  var body = req.body;
  var pkId = body.pkId;
  var userId = body.userId;
  if (!pkId || !userId) {
    return res.json({code:-1,message:'参数错误'})
  }

  pkModel.updateOne({gameId},{
    endTime:new Date()
  },(err)=>{
   return res.json({code:0})
  })

})
