// pages/bind-device/index.js

import API from '../../request/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
      lists:[]
  },


  discoveryBLE() {
    wx.getBluetoothDevices({
      success: (res) => {
        console.log(res.devices)
        var filterDevices = res.devices;
        // var filterDevices = res.devices.filter((d) => {
        //   if (d.advertisServiceUUIDs && d.advertisServiceUUIDs.length) {
        //     const uuid = d.advertisServiceUUIDs[0];
        //     const list = uuid.split('-');
        //     if (list[0].indexOf('1812') !== -1) {
        //       return true
        //     } else {
        //       return false;
        //     }
        //   } else {
        //     return false
        //   }
        // })
        var lists = filterDevices.filter((f) => {
          let uuidsList = [];
          this.data.lists.forEach((l) => {
            uuidsList = uuidsList.concat(l.advertisServiceUUIDs)
          })
          if (uuidsList.indexOf(f.advertisServiceUUIDs[0]) !== -1) {
            return false
          } else {
            return true;
          }
        })
        this.setData({
          lists: this.data.lists.concat(lists)
        })
      }
    })
  },


  findBLE: function () {
    wx.startBluetoothDevicesDiscovery({
      success: (res) => {
        this.setData({
          isfound:true
        })
        const timer = setInterval(() => {
          this.discoveryBLE()
        }, 2000)
        this.setData({ timer })
      },
    })
  },


  initBLE: function () {
    wx.openBluetoothAdapter({
      success: (res) => {
        console.log('打开蓝牙适配成功', res)
        this.setData({
          isadapter:true
        })
        this.findBLE();
      },
      fail: (err) => {
        console.log('打开蓝牙失败', err)
        wx.showToast({
          title: '请确认蓝牙是否打开',
          icon: 'none'
        })
      }
    })
  },
  uninitBle() {
    if (this.data.timer) {
      clearInterval(this.data.timer)
      this.setData({
        timer:null
      })
    }
    if (this.data.isfound) {
      wx.stopBluetoothDevicesDiscovery();
      this.setData({
        isfound:false
      })
    }

  if (this.data.isadapter) {
    wx.closeBluetoothAdapter();
    this.setData({
      isadapter:false
    })
  }

  },


  getdeviceList() {
    API.getMyDeviceList()
      .then((res) => {
        console.log('##3get device list is ', res)
      })
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
  this.getdeviceList()
  .then(()=>{
    this.initBLE();
  })
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
    this.uninitBle();
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