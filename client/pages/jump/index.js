
import Storage from '../../utils/storage'
import Ble from '../../utils/ble'
import moment from '../../moment/index'
Page({
  data:{
    mode:'',
    hour:'',
    minute:'',
    count:0,
    nowCount:0,
    ka:0,
    nowTime:'00:00:00'
  },
  changeDate(seconds) {
    var data = moment.duration(seconds, 'seconds')

    // 案例：时分秒 00:00:00
    return [data.hours(), data.minutes(), data.seconds()].join(":")

  },

  onCharacterValueChange(){
    const deviceId = this.data.deviceId;
    Ble.listenCharacterValue(deviceId,(value)=>{
      this.setData({
        nowCount:value.count,
        nowTime:this.changeDate(value.time)
      })
    })
  },

  sendCmd(){
    const deviceId =this.data.deviceId
    const timer = setInterval(() => {
      Ble.sendReadDataCmd(deviceId);
    }, 2000);
    this.setData({timer})
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
      deviceId
    })
    var option = {};
    if (mode === 1) {
      option.hour = hour;
      option.minute = minute;
    }else if (mode === 2) {
      option.count = count
    }

    Ble.sendMode(deviceId,mode,option)
    .then(()=>{
      this.onCharacterValueChange()
      this.sendCmd();
    },()=>{
      wx.showModal({
        title:'提示',
        content:'模式设置失败，请检查设备'
      })
    })
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