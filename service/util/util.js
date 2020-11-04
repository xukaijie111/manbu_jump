
var moment = require('moment')
function generateUserId(){
    var userId = "";
    for(var i = 0; i < 10; ++i){
        userId += Math.floor(Math.random()*10);
    }
    return userId;
}

function generateGameId(){
  var gameId = "";
  for(var i = 0; i < 5; ++i){
    gameId += Math.floor(Math.random()*10);
  }
  return gameId;
}

function generatePkId(){
  var gameId = "";
  for(var i = 0; i < 6; ++i){
    gameId += Math.floor(Math.random()*10);
  }
  return gameId;
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function changeDate(seconds) {
  var data = moment.duration(seconds, 'seconds')

  // 案例：时分秒 00:00:00
  return [data.hours(), data.minutes(), data.seconds()].map(formatNumber).join(":")
}

module.exports = {
  generateUserId,
  generateGameId,
  generatePkId,
  changeDate
}