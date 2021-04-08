
import {
  SCAN_PARAMETERS
} from './const.js'

const system = wx.getSystemInfoSync();
const isPhone = system.platform === 'ios'

class Ble {
  constructor() {
    this.isStart = false;
    this.lists = [];
    this.listenBleState();
  }

  listenBleState() {
    wx.onBLEConnectionStateChange((res) => {
      const deviceId = res.deviceId;
      const connected = res.connected
      const deviceIdLists = this.lists.map((l) => { return l.deviceId })
      const index = deviceIdLists.indexOf(deviceId)
      if (index !== -1 && !connected) {
        this.lists.splice(index, 1)
      }

    })
  }

  connectDevice(deviceId) {
    return new Promise((resolve, reject) => {
      wx.createBLEConnection({
        deviceId,
        success: (res) => {
          console.log('####connect suc')
          resolve();
        },
        fail: (err) => {
          console.log('###connect fail', err)
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
    var time = timeH ? timeH << 8 + timeL : timeL
    var count = countH ? countH << 8 + countL : countL
    console.log('#####countLcountH', countL, countH, timeL, timeH)
    return {
      count,
      time
    }
  }

  // 监听计数的值
  listenCharacterValue(deviceId, callback) {
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

  openAdapter() {
    return new Promise((resolve, reject) => {
      wx.openBluetoothAdapter({
        mode:'central',
        success: function (res) {
          console.log('###open adapter suc')
          resolve()
        },
        fail: (err) => {
          console.log('###open adapter fail', err)
          reject();
        }
      })
    })
  }

  startDiscoveryBleDevice() {
    return new Promise((resolve, reject) => {
      wx.startBluetoothDevicesDiscovery({
        success: (res) => {
          console.log('###startBluetoothDevicesDiscovery suc')
          resolve();
        },
        fail: (err) => {
          console.log('###startBluetoothDevicesDiscovery fail', err)

          reject();
        }
      })
    })

  }

  stopDiscoverBleDevice() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null;
    }
    wx.stopBluetoothDevicesDiscovery({
      success: function (res) { },
      fail: (err) => {
        console.log('####stopBluetoothDevicesDiscovery', err)
      }
    })
  }

  getBleDevice() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    let self = this;
    function get() {
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
            self.lists.forEach((l) => {
              uuidsList = uuidsList.concat(l.advertisServiceUUIDs)
            })
            const index = uuidsList.indexOf(f.advertisServiceUUIDs[0]);
            if (index !== -1) {
              return false
            } else {
              return true;
            }
          })

          if (isPhone) {
            lists.forEach((l)=>{
              l.name = l.name || "MS1793 JUMP"
            })
          }

          self.lists = self.lists.concat(lists)
        }
      })
    }
    get();
    this.timer = setInterval(() => {
      get();
    }, 2000)

  }

  async findBleDevices() {
    try {
      await this.openAdapter();
      await this.startDiscoveryBleDevice();
      this.getBleDevice();
    } catch (err) {

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

  sendMode(deviceId, mode, options) {
    console.log('####set mode ', mode, options)
    var buffer = new ArrayBuffer(7);
    var dataview = new DataView(buffer)
    dataview.setUint8(0, 0xf3)
    if (mode === 0) { // 自由
      dataview.setUint8(1, 0)
      dataview.setUint16(2, 0)
      dataview.setUint16(4, 0)
      dataview.setUint8(6, 0xf3)
    } else if (mode === 1) { //时间跳
      var hour = parseInt(options.hour);
      var minute = parseInt(options.minute);
      var seconds = hour * 60 * 60 + minute * 60;
      console.log('##seconds is ', seconds)
      let low = seconds & 0xff;
      let high = seconds >> 8;


      console.log('###high low is ', high, low)
      let sum = (0xf3+1+seconds) & 0xff
      dataview.setUint8(1, 1)
      dataview.setUint16(2, 0) // count

      dataview.setUint8(4, low) //time
      dataview.setUint8(5, high)
      dataview.setUint8(6, sum)
    } else if (mode === 2) { // 计数跳
      var count = options.count;
      let low = count & 0xff;
      let high = count >> 8;

      let sum = (0xf3 + 2 + count) & 0xff
      dataview.setUint8(1, 2)
      dataview.setUint8(2, low) //count
      dataview.setUint8(3, high)
      dataview.setUint16(4, 0) //time
      dataview.setUint8(6,sum)
    }

    return new Promise((resolve, reject) => {
      wx.writeBLECharacteristicValue({
        characteristicId: SCAN_PARAMETERS.scan_interface_window,
        deviceId,
        serviceId: SCAN_PARAMETERS.uuid,
        value: buffer,
        success: (res) => {
          console.log('##set mode suc')
          resolve();
        },
        fail: (err) => {
          console.log(err)
          reject()
        }
      })
    })



  }

  getDeviceServices(deviceId){
    return new Promise((resolve,reject)=>{
      wx.getBLEDeviceServices({
        deviceId,
        success:(res)=>{
          console.log('###get services is ',res)
          resolve()
        },
        fail:(err)=>{
          console.log('get service error is ',err)
          reject()
        }
      })
    })
  }

  getCharacters(deviceId){
    return new Promise((resolve,reject)=>{
      wx.getBLEDeviceCharacteristics({
        deviceId,
        serviceId: SCAN_PARAMETERS.uuid,
        success:(res)=>{
          console.log('###get character is ',res)
          resolve()
        },
        fail:(err)=>{
          console.log('get charect error is ',err)
          reject()
        }
      })
    })
  }

  // wx.getBLEDeviceServices({
      //   deviceId,
      //   success:(res)=>{
      //     console.log('##get service is ',res)
      //     wx.getBLEDeviceCharacteristics({
      //       deviceId,
      //       serviceId:'00001813-0000-1000-8000-00805F9B34FB',
      //       success:(res)=>{
      //         console.log('##get chara is ',res)
      //       },
      //       fail:(err) =>{
      //         console.log('##get character fail is ',err)
      //       }
      //     })
      //   },
      //   fail:(err) =>{
      //     console.log('##get character fail is ',err)
      //   }
      // })


}

export default new Ble();