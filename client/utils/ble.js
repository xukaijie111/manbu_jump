
import {
  SCAN_PARAMETERS
} from './const.js'

class Ble{
  constructor(){
    this.isStart = false;
    this.lists = [];
    this.listenBleState();
  }

  listenBleState(){
    wx.onBLEConnectionStateChange( (res) =>{
        const deviceId = res.deviceId;
      const connected = res.connected
      const deviceIdLists = this.lists.map((l)=>{return l.deviceId})
      const index = deviceIdLists.indexOf(deviceId)
      if (index !== -1) {
        this.lists[index].connected = connected
      }

    })
  }

 connectDevice(deviceId){
    return new Promise((resolve,reject)=>{
      wx.createBLEConnection({
        deviceId,
        success: (res) => {
          console.log('####connect suc')
          resolve();
        },
        fail:(err)=>{
          console.log('###connect fail',err)
          reject();
        }
      })
    })

  }
  buf2Array(buffer) { // buffer is an ArrayBuffer
    var dataView = new DataView(buffer);
    var countL = dataView.getUint8(2);
    var countH = dataView.getUint8(3);
    var timeL = dataView.getUint8(4);
    var timeH = dataView.getUint8(5);
    var time = timeH?timeH+255+timeL:timeL
    var count = countH ? countH + 255 + countL : countL
    return{
      count,
      time
    }
  }

 // 监听计数的值
  listenCharacterValue(deviceId,callback){
    wx.notifyBLECharacteristicValueChange({
      deviceId: deviceId,
      serviceId: SCAN_PARAMETERS.uuid,
      characteristicId: SCAN_PARAMETERS.scan_param,
      state: true,
      success: (res) => {
        console.log('####notifyBLECharacteristicValueChange suc', res)
        wx.onBLECharacteristicValueChange((res) => {
          console.log(`characteristic ${res.characteristicId} has changed, now is ${res.value}`)
          const hex = this.buf2Array(res.value)
          console.log(hex, typeof hex)
          callback(hex)
        })
      },
      fail: (err) => {
        console.log('####notifyBLECharacteristicValueChange fail', err)
      }
    })
  }

  openAdapter(){
    return new Promise((resolve,reject)=>{
      wx.openBluetoothAdapter({
        success: function(res) {
          console.log('###open adapter suc')
          resolve()
        },
        fail:(err)=>{
          console.log('###open adapter fail',err)
          reject();
        }
      })
    })
  }

  startDiscoveryBleDevice(){
    return new Promise((resolve,reject)=>{
      wx.startBluetoothDevicesDiscovery({
        success: (res) => {
          console.log('###startBluetoothDevicesDiscovery suc')
            resolve();
        },
        fail:(err) =>{
          console.log('###startBluetoothDevicesDiscovery fail',err)

          reject();
        }
      })
    })
    
  }

  stopDiscoverBleDevice(){
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null;
    }
    wx.stopBluetoothDevicesDiscovery({
      success: function(res) {},
      fail:(err)=>{
        console.log('####stopBluetoothDevicesDiscovery',err)
      }
    })
  }

  getBleDevice(){
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    this.timer = setInterval(()=>{
      wx.getBluetoothDevices({
        success: (res) => {
          console.log(res.devices)
          var filterDevices = res.devices;
          var filterDevices = res.devices.filter((d) => {
            if (d.advertisServiceUUIDs && d.advertisServiceUUIDs.length) {
              const uuid = d.advertisServiceUUIDs[0];
              const list = uuid.split('-');
              if (list[0].indexOf('1812') !== -1) {
                return true
              } else {
                return false;
              }
            } else {
              return false
            }
          })
          var lists = filterDevices.filter((f) => {
            let uuidsList = [];
            this.lists.forEach((l) => {
              uuidsList = uuidsList.concat(l.advertisServiceUUIDs)
            })
            const index = uuidsList.indexOf(f.advertisServiceUUIDs[0]);
            if (index !== -1) {
              return false
            } else {
              return true;
            }
          })

          this.lists = this.lists.concat(lists)
        }
      })
    },2000)
   
  }

  async findBleDevices(){
    try{
        await this.openAdapter();
        await this.startDiscoveryBleDevice();
        this.getBleDevice();
    }catch(err){

    }
  }

  sendReadDataCmd(deviceId) {
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
      deviceId: deviceId,
      // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
      serviceId: SCAN_PARAMETERS.uuid,
      // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
      characteristicId: SCAN_PARAMETERS.scan_interface_window,
      // 这里的value是ArrayBuffer类型
      value: buffer,
      success(res) {
        console.log('writeBLECharacteristicValue success', res.errMsg)
      },
      fail: (err) => {
        console.log('###write cmd error is ', err)
      }
    })
  }

  sendMode(deviceId,mode,options){
    var buffer = new ArrayBuffer(7);
    var dataview = new DataView(buffer)
    dataview.setUint8(0,0xf3)
    if (mode === 0) {
      dataview.setUint8(1,0)
      dataview.setUint16(2,0)
      dataview.setUint16(4,0)
      dataview.setUint8(6,0xf3)
    }else if (mode === 1) { //时间跳
      var hour = parseInt(options.hour);
      var minute = parseInt(options.minute);
      var seconds = hour*60*60+minute*60;
      let high = 0;
      let low = seconds;
      if (seconds > 255) {
        high = seconds - 255
        low = 255
      }
      dataview.setUint8(1,1)
      dataview.setUint8(2,low)
      dataview.setUint8(3,high)
      dataview.setUint16(4,seconds)
      dataview.setUint8(6,0xf3+1+seconds)
    }else if(mode === 2) {
      var count = options.count;
      let high = 0;
      let low = seconds;
      if (count > 255) {
        high = seconds - 255
        low = 255
      }
      dataview.setUint8(1,2)
      dataview.setUint8(2,low)
      dataview.setUint8(3,high)
      dataview.setUint16(4,0)
      dataview.setUint8(6,0xf3+2+count)
    }

    return new Promise((resolve,reject)=>{
      wx.writeBLECharacteristicValue({
        characteristicId: SCAN_PARAMETERS.scan_interface_window,
        deviceId,
        serviceId: SCAN_PARAMETERS.uuid,
        value: buffer,
        success:(res)=>{
          console.log('##set mode suc')
          resolve();
        },
        fail:(err) =>{
          console.log(err)
          reject()
        }
      })
    })



  }

}

export default new Ble();