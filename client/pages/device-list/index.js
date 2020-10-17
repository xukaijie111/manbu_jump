// pages/device-list/index.js
import  { BATTER_SERVICE } from '../../utils/const.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists:[]
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
  connectBle(e) {
    const index = e.currentTarget.dataset.index;
    const deviceId = this.data.lists[index].deviceId;
    console.log('####connect deviceid is ',deviceId);
    this.connectTO(deviceId)
  },

  connectTO(deviceId) {
    wx.createBLEConnection({

      deviceId: deviceId,

      success:  (res) => {
          console.log('connect res is ',res)
        wx.readBLECharacteristicValue({
          deviceId,
          serviceId:BATTER_SERVICE.uuid,
          characteristicId: BATTER_SERVICE.battery_character_uuid,
          success:(res)=>{
            console.log('####read battery ok ')
            wx.onBLECharacteristicValueChange((res)=>{
              console.log('####resad battery is ', this.ab2hex(res.value)) //0x0c
            })
          }
        })
     
      },

      fail: function (res) {
        console.log('connect fail res is ',res)
      }

    })

  },

  discoveryBLE() {
    wx.getBluetoothDevices({
      success: (res) => {
        console.log(res.devices)
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
        var lists = filterDevices.filter((f)=>{
          let uuidsList = [];
           this.data.lists.forEach((l)=>{
              uuidsList = uuidsList.concat(l.advertisServiceUUIDs)
          })
          if (uuidsList.indexOf(f.advertisServiceUUIDs[0]) !== -1) {
            return false
          }else{
            return true;
          }
        })
        this.setData({
          lists:this.data.lists.concat(lists)
        })
      }
    })
  },

  findBLE: function () {
    wx.startBluetoothDevicesDiscovery({
      success: (res) => {
        const timer = setInterval(() => {
          this.discoveryBLE()
        }, 1000)
        this.setData({ timer })
      },
    })
  },
  initBLE: function () {
    console.log('初始化蓝牙设备')
    wx.openBluetoothAdapter({
      success: (res) => {
        console.log('打开蓝牙适配成功', res)
        this.findBLE();
      },
      fail: (err) => {
        console.log('打开蓝牙失败', err)
        wx.showToast({
          title: '请打开蓝牙',
          icon: 'none'
        })
      }
    })
  },

  uninitBle() {
    if (this.data.timer) {
      clearInterval(this.data.timer)
    }
    wx.stopBluetoothDevicesDiscovery();
    wx.closeBluetoothAdapter();
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.initBLE();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})