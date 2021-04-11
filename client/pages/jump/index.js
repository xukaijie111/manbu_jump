
import Storage from '../../utils/storage'
import Ble from '../../utils/ble'
import moment from '../../moment/index'
import API from '../../request/api.js'
var lastCount = 0;
import {
  formatNumber,
  compThrottled
} from '../../utils/util'

const STATUS_NO_START = 0;
const STATUS_DOING = 1;
const STATUS_IS_STOP  = 2;
const STATUS_END = 3
Page({
  data:{
    status: STATUS_NO_START,
    mode:'',
    hour:'',
    minute:'',
    count:0,
    freeData:{
      count:0,
      timeStr:'00:00:00'
    },
    timeData:{
      count:0,
      timeStr:0
    },
    countData: {
      count: 0,
      timeStr:0
    },
    ka:0,
    nowCount:0,
    gameId:''
  },

  updateToServer(){

   // count++;
    if (!this.data.gameId) return
    const count = this.data.nowCount;
    if (count === lastCount) return;
    lastCount = count;
    API.updateGame({
      gameId:this.data.gameId,
      count,
    })
  },
  changeDate(seconds) {
    console.log('###seconds is ',seconds)
    var data = moment.duration(seconds, 'seconds')

    // 案例：时分秒 00:00:00
    return [data.hours(), data.minutes(), data.seconds()].map(formatNumber).join(":")
  },

  updateViewData(value){
    const mode = this.data.mode;
    const timeStr = this.changeDate(value.time);
    let nowCount = 0;
  
    switch(mode) {
      case 0: //自由跳
        let freeData = this.data.freeData;
        nowCount = freeData.count = value.count;
        freeData.timeStr = timeStr
        this.setData({freeData,nowCount})
        break;
      case 1:  // 计数跳
      let countData = this.data.freeData;
      countData.count = value.count;
      countData.timeStr = timeStr;
      nowCount = Math.abs(value.count - this.data.count)
      this.setData({ countData,nowCount })
        break;
      case 2: //计时跳

        let timeData = this.data.freeData;
        timeData.count = value.count;
        timeData.timeStr = timeStr
        this.setData({ timeData })
     
         break;
    }
  },

  onCharacterValueChange(){
    const deviceId = this.data.deviceId;
    Ble.listenCharacterValue(deviceId,(value)=>{
      this.updateViewData(value)
      this.updateToServer();
    })
  },

  sendCmd(){
    const deviceId =this.data.deviceId
    const timer = setInterval(() => {
      Ble.sendReadDataCmd(deviceId);
      //this.updateToServer();
    }, 1000);
    this.setData({timer})
  },

  endGame(){
    //if (this.data.status !== STATUS_DOING) return
    API.endGame({
      gameId:this.data.gameId
    });
    setTimeout(()=>{
      this.destroyTimer();
    },1000)
  },

  startGame(){
    API.createGame({
      deviceId:this.data.deviceId,
      mode:this.data.mode,
    })
    .then((res)=>{
      console.log('####create game is',res)
      this.sendCmd();
      this.setData({
        status:STATUS_DOING
      })
      const gameId = res.gameId;
      this.setData({
        gameId
      })
      //this.setBleMode();
    })
  },

  setBleMode(){
    let mode = this.data.mode;
    const deviceId  = this.data.deviceId;
    const { hour,minute,count} = this.data;
    var option = {};
    if (mode === 1) {
      option.count = count
    
    } else if (mode === 2) {
      option.hour = hour;
      option.minute = minute;
    }
    Ble.sendMode(deviceId, mode, option)
      .then(() => {
        this.clickStart();
      }, () => {
        wx.showModal({
          title: '提示',
          content: '模式设置失败，请检查设备'
        })
      })
  },

  clickStart(){
    this.onCharacterValueChange()
    this.startGame();
  },

  _clickEnd(){
    this.endGame();
  },

  onLoad(options){
    this.clickEnd = compThrottled(this._clickEnd.bind(this))
    var mode = parseInt(options.mode)
    const deviceId = options.deviceId
    var count = Storage.count || 100
    var hour = Storage.hour || 0
    var minute = Storage.minute || 30
    this.setData({
      mode,
      hour,
      minute,
      count,
      deviceId,
    })
    
    this.setBleMode();

  },

  destroyTimer(){
    if (this.data.timer) {
      clearInterval(this.data.timer)
      this.setData({
        timer: null
      })
    }
  },
  onUnload(){
    this.destroyTimer();
    this.endGame();
  }
})