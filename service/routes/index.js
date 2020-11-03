var express = require('express');
var router = express.Router();
var moment = require('moment')
var {
  gameModel,
} = require('../db/db')

var {
  changeDate
} = require('../util/util')

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

  let startTime = new Date(moment().format('YYYY-MM-DD'));
  let endTime = new Date(moment().add(1, 'days').format('YYYY-MM-DD'));
  console.log('###startime',startTime,endTime)
  gameModel.find({ $and: [{userId},{ startTime: { $gt: startTime } }, { endTime: { $lt: endTime } }] }) //实现第一种情况
  .select("-_id count ka endTime startTime")
  .exec((err,list)=>{
    console.log('####err')
    if (err) {
      return res.json({code:-1,message:'查询错误'})
    }

    const jumpCount = list.length;
    let count = 0;
    let ka = 0;
    let seconds = 0;
    list.forEach((l)=>{
      count+=l.count;
      ka+=l.ka;
      seconds += moment(l.endTime).diff(moment(l.startTime), 'seconds')
    })
    let time = changeDate(seconds)

    res.json({code:0,data:{
        jumpCount,count,ka,time
    }})

  })		

})

module.exports = router;
