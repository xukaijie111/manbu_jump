var express = require('express');
var router = express.Router();

var axios = require('axios');

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
    return res.json({code:0})
  }catch(err) {
    console.log(err);
  }

})

module.exports = router;
