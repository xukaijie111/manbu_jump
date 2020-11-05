
class PK{
  constructor(param) {
    this.pkId = param.pkId;
    this.startTime = '';
    this.endTime = '';
    this.ownerId = param.userId;
    this.winerId = '';
    this.maxMan = param.maxMan;
    this.mode = param.mode;
    this.maxSeconds = param.maxSeconds;
    this.maxCount = param.maxCount;
    this.userList = [];
    this.createdAt = '';
    this.updatedAt = '';
    this.isStart = false;
    
    this.init();
  }

  init(){
    this.createdAt = new Date();
  }

  editPk(option) {
    for (var key in option) {
      if (this.hasOwnProperty(key))
          this[key] = option.key
    }
  }

  startPk(){
    this.isStart = true;

  }
}

module.exports = PK;