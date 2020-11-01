

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


module.exports = {
  generateUserId,
  generateGameId
}