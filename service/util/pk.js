
class PK{
  constructor({
    pkId = '',
    ownerId = '',
    maxMan = 0,
    maxSeconds = 0,
    maxCount = 0,
    mode = 1,
  }) {
    this.pkId = pkId;
    this.startTime = '';
    this.endTime = '';
    this.ownerId = ownerId;
    this.winerId = '';
    this.maxMan = maxMan;
    this.mode = mode;
    this.maxSeconds = maxSeconds;
    this.maxCount = maxCount;
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