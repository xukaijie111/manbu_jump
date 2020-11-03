
import Storage from '../../utils/storage'
import Ble from '../../utils/ble'
import moment from '../../moment/index'
import API from '../../request/api.js'
import {
  formatNumber
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
      timeStr:''
    },
    timeData:{
      count:0,
      timeStr
    },
    countData: {
      count: 0,
      timeStr
    },
    ka:0,

    gameId:''
  },

  updateToServer(){
    if (!this.data.gameId) return
    const count = this.data.nowCount;
    Ble.updateGame({
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
    switch(mode) {
      case 0:
        let freeData = this.data.freeData;
        freeData.count = value.count;
        freeData.timeStr = timeStr
        this.setData({freeData})
        break;
      case 1:
        let timeData = this.data.freeData;
        timeData.count = value.count;
        timeData.timeStr = timeStr
        this.setData({ timeData })
        break;
      case 2:
        let countData = this.data.freeData;
        countData.count = value.count;
        countData.timeStr = timeStr
        this.setData({ countData })
         break;
    }
  },

  onCharacterValueChange(){
    const deviceId = this.data.deviceId;
    Ble.listenCharacterValue(deviceId,(value)=>{
      this.setData({
        nowCount:value.count,
        nowTime:this.changeDate(value.time)
      })
      this.updateToServer();
    })
  },

  sendCmd(){
    const deviceId =this.data.deviceId
    const timer = setInterval(() => {
      Ble.sendReadDataCmd(deviceId);
    }, 1000);
    this.setData({timer})
  },

  startGame(){
    API.createGame({
      deviceId:'22'
    })
    .then((res)=>{
      const gameId = res.gameId;
      this.setData({
        gameId
      })
      this.setBleMode();
    },()=>{
      this.setBleMode();
    })
  },

  setBleMode(){
    let mode = this.data.mode;
    var option = {};
    if (mode === 1) {
      option.hour = hour;
      option.minute = minute;
    } else if (mode === 2) {
      option.count = count
    }

    Ble.sendMode(deviceId, mode, option)
      .then(() => {
        this.onCharacterValueChange()
        this.sendCmd();
      }, () => {
        wx.showModal({
          title: '提示',
          content: '模式设置失败，请检查设备'
        })
      })
  },

  onLoad(options){
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
      deviceId:'222'
    })
    
    this.setBleMode();
  },
  onUnload(){
    if (this.data.timer) {
      clearInterval(this.data.timer)
      this.setData({
        timer:null
      })
    }
  }
})