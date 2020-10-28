

import Ble from '../../utils/ble.js'
import moment from '../../moment/index.js'

Page({
  data:{
    time:'00:00:00',
    count:0,
   
  },


  handleResult(res){
      
  },

  changeDate(seconds) {
    var data = moment.duration(seconds, 'seconds')

    // 案例：时分秒 00:00:00
    return [data.hours(), data.minutes(), data.seconds()].join(":")

  },

  onNotifyCharacterValue(){
    Ble.listenCharacterValue(this.data.deviceId,(value)=>{
          this.setData({
            time: this.changeDate(value.time),
            count:value.count
          })
    })
  },

  sendReadDataCmd(){
    Ble.sendReadDataCmd(this.data.deviceId)
  },
  onLoad(options){
    console.log('###options is ',options)
    const deviceId = options.deviceId;
    const name = options.name;
    this.setData({
      deviceId,
      name:name
    })
  },

  onReady(){
    // this.onNotifyCharacterValue();
    // setInterval(()=>{
    //   this.sendReadDataCmd();
    // },2000)
  },
})