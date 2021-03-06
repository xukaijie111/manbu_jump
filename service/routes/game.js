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
          id:gameId,
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


router.post('/update_game',(req,res,next) => {
  var body = req.body;
  var gameId = body.gameId;
  var userId = body.userId;
  if (!gameId || !userId) {
    return res.json({code:-1,message:'参数错误'})
  }

  gameModel.findOne({id:gameId})
  .exec((err,ret)=>{
    if (err) {
      return res.json({code:-2,message:'操作数据库错误'})
    }
    
    gameModel.updateOne({gameId:gameId},body,(err)=>{
      if (err) {
        return res.json({code:-2,message:'操作数据库错误'})
      }
      res.json({code:0})
    })
  })

})


module.exports = router;