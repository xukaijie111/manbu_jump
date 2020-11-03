var express = require('express');
var router = express.Router();
var  {
  gameModel 
} = require('../db/db')

var Util = require('../util/util')

var creatingGame = {};

function createGame(option,res){
  var gameId = Util.generateGameId();
  if (creatingGame[gameId]){
      createGame(option,res)
      return;
  }
  creatingGame[gameId] = true;

  gameModel.findOne({gameId:gameId})
  .select("-_id")
  .exec((err,ret)=> {
      if (err){
          res.json({code:-2,message:'读取数据库错误'})
          delete creatingGame[gameId]
          return
      }

      if (ret && ret.length){
          delete creatingGame[gameId];
          createGame(option,res)
          return
      }

      var condition = {
          startTime:new Date(),
          gameId:gameId,
          ...option
      }
      gameModel.create(condition,  (err, doc) => {
          if (err) {
              delete creatingGame[gameId]
              res.json({code:-2,message:"插入数据错误"});
          } else {
              delete creatingGame[gameId]
              res.json({code:0,data:{
                gameId,
              }})
          }
      })

  })


}

router.post('/create_game',(req,res,next)=>{
  var body = req.body;
  var deviceId = body.deviceId;
  var userId = body.userId;
  if (!deviceId || !userId) {
    return res.json({code:-1,message:'参数错误'})
  }

  return createGame(body,res)

})

router.post('/end_game',(req,res,next)=>{

  var body = req.body;
  var gameId = body.gameId;
  var userId = body.userId;
  if (!gameId || !userId) {
    return res.json({code:-1,message:'参数错误'})
  }

  gameModel.updateOne({gameId},{
    endTime:new Date()
  },(err)=>{
   return res.json({code:0})
  })

})


router.post('/update_game',(req,res,next) => {
  var body = req.body;
  var gameId = body.gameId;
  var userId = body.userId;
  if (!gameId || !userId) {
    return res.json({code:-1,message:'参数错误'})
  }

  gameModel.findOne({gameId})
  .exec((err,ret)=>{
    if (err) {
      return res.json({code:-2,message:'操作数据库错误'})
    }
    if (ret.endTime) return res.json({code:0})
   var data = {
     count:body.count?parseInt(body.count):0,
   }
    gameModel.updateOne({gameId:gameId},data,(err)=>{
      if (err) {
        return res.json({code:-2,message:'操作数据库错误'})
      }
      res.json({code:0})
    })
  })

})


module.exports = router;