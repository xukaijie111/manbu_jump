
import Ble from '../../utils/ble.js'
Page({
  data:{
   
  },

  // 16进制转10进制
  hex2dex(str) {
    return parsetInt(parseInt(str, 16).toString(10));
  },

  ab2hex(buffer) {
    let hexArr = Array.prototype.map.call(
      new Uint8Array(buffer),
      function (bit) {
        return ('00' + bit.toString(16)).slice(-2)
      }
    )
    return hexArr.join('');
  },

  handleResult(res){
      
  },

  onNotifyCharacterValue(){
    Ble.listenCharacterValue(this.data.deviceId,(value)=>{
        
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
    Ble.listenCharacterValue(this.data.deviceId)
    setInterval(()=>{
      this.sendReadDataCmd();
    },2000)
  },
})