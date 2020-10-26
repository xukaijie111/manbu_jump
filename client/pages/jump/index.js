
import {
  SCAN_PARAMETERS
} from '../../utils/const.js'
Page({
  data:{
   
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
    wx.notifyBLECharacteristicValueChange({
      deviceId:this.data.deviceId,
      serviceId:SCAN_PARAMETERS.uuid,
      characteristicId: SCAN_PARAMETERS.scan_param,
      state:true,
      success:(res)=>{
        console.log('####notifyBLECharacteristicValueChange suc',res)
        wx.onBLECharacteristicValueChange( (res)=> {
          console.log(`characteristic ${res.characteristicId} has changed, now is ${res.value}`)
          const hex = this.ab2hex(res.value)
          console.log(hex,typeof hex)
        })
      },
      fail:(err) =>{
        console.log('####notifyBLECharacteristicValueChange fail', err)
      }
    })
  },

  sendReadDataCmd(){
    let buffer = new ArrayBuffer(7)
    let dataView = new DataView(buffer)
    dataView.setUint8(0, 0xf4)
    dataView.setUint8(1, 0)
    dataView.setUint8(2, 0)
    dataView.setUint8(3, 0)
    dataView.setUint8(4, 0)
    dataView.setUint8(5, 0)
    dataView.setUint8(6, 0xf4)

    wx.writeBLECharacteristicValue({
      // 这里的 deviceId 需要在 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
      deviceId:this.data.deviceId,
      // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
      serviceId: SCAN_PARAMETERS.uuid,
      // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
      characteristicId: SCAN_PARAMETERS.scan_interface_window,
      // 这里的value是ArrayBuffer类型
      value: buffer,
      success(res) {
        console.log('writeBLECharacteristicValue success', res.errMsg)
      },
      fail:(err) =>{
        console.log('###write cmd error is ',err)
      }
    })
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
    this.onNotifyCharacterValue();
    setInterval(()=>{
      this.sendReadDataCmd();
    },2000)
  },
})