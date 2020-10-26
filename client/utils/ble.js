
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
    wx.onBLEConnectionStateChange(function (res) {
        const deviceId = res.deviceId;
      const connected = res.connected
      const deviceIdLists = this.lists.map((l)=>{return l.deviceId})
      const index = deviceIdLists.indexOf(deviceId)
      if (index !== -1) {
        this.lists[index].connected = connected
      }

    })
  }

 async connectDevice(deviceId){
    return new Promise((resolve,reject)=>{
      wx.createBLEConnection({
        deviceId,
        success: (res) => {
          resolve();
        },
        fail:(err)=>{
          reject();
        }
      })
    })

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
          const hex = this.ab2hex(res.value)
          console.log(hex, typeof hex)
          callback(hex)
        })
      },
      fail: (err) => {
        console.log('####notifyBLECharacteristicValueChange fail', err)
      }
    })
  }

  async openAdapter(){
    return new Promise((resolve,reject)=>{
      wx.openBluetoothAdapter({
        success: function(res) {
          resolve()
        },
        fail:(err)=>{
          reject();
        }
      })
    })
  }

  async startDiscoveryBleDevice(){
    return new Promise((resolve,reject)=>{
      wx.startBluetoothDevicesDiscovery({
        success: (res) => {
            resolve();
        },
        fail:(err) =>{
          reject();
        }
      })
    })
    
  }

  stopDiscoverBleDevice(){
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
  }

  async findBleDevices(){
    try{
        await this.openAdapter();
        await startDiscoveryBleDevice();
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

}

export default new Ble();