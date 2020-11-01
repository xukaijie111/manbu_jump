var express = require('express');
var router = express.Router();
var moment = require('moment')
var {
  deviceModel,
} = require('../db/db')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/get_today_info',(req,res,next)=>{

  var body = req.body;
  var userId = body.userId;
  if (!userId) {
    return res.json({code:-1,message:'参数错误'})
  }
  
})

module.exports = router;
