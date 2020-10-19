var express = require('express');
var router = express.Router();
var  {
  deviceModel 
} = require('../db/db')

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

router.post('/get_my_device_list',(req,res,next)=>{
  var body = req.body;
  var userId = body.userId;
  if (!userId) {
    return res.json({code:-1,message:'参数错误'})
  }
  deviceModel
  .find({userId})
  .select("-_id createTime")
  .sort({createTime:-1})
  .exec((err,ret)=>{
    if (err){
     return res.json({code:-2,message:'读取数据库错误'})
    }else{
    return res.json({code:0,data:{
      list:ret
    }})
    }
  })

})


module.exports = router;