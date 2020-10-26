// pages/sport/index.js
import {
  compThrottled
} from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectDeviceShow:false,
    lists: [
   
    ],

    connectedDeviceId:'',
    modeList:[
     {
       name:'自由跳模式',
       description:'畅享欢乐跳',
        src: '/images/jump.png' 
     },{
       name:'计时模式',
       description:'手动设置时间',
        src: '/images/time.png' 
     },{
       name:'计数模式',
       description:'手动设置计数',
        src: '/images/counter.png' 
     }
    ]
  },

  closeSelectDeviceShow(){
    this.uninitBle();
    this.setData({
      selectDeviceShow:false
    })
  },

  _clickJumpMode(){
    this.initBle();
    this.setData({
      selectDeviceShow: true
    })
  },

  _connectBle(e) {
    console.log('connect e is ',e)
    const index = e.detail.index;
    wx.showLoading({
      title: '连接中...',
      mask:true
    })
    const deviceId = this.data.lists[index].deviceId;
    const name = this.data.lists[index].name
    wx.createBLEConnection({
      deviceId,
      success:()=>{
        wx.hideLoading();
        this.uninitBle();
        wx.showToast({
          title: '连接成功',
        })

        wx.navigateTo({
          url: `/pages/jump/index?deviceId=${deviceId}&name=${name}`
        })
      },
      fail:(err) => {
        wx.hideLoading();
        wx.showModal({
          title: '错误',
          content: '连接失败，请确认设备是否正常，或者已被其他终端连接',
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.clickJumpMode = compThrottled(this._clickJumpMode.bind(this))
    this.connectBle = compThrottled(this._connectBle.bind(this))
  },

  initBle(){
    wx.openBluetoothAdapter({
      success: (res)=> {
        this.setData({
          isadapter: true
        })
        this.findBLE();
      },
      fail:()=>{
        wx.showModal({
          title: '错误',
          content: '打开蓝牙失败，请检查是否开启蓝牙功能',
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

  discoveryBLE() {
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
        isfound: false
      })
    }

    // if (this.data.isadapter) {
    //   wx.closeBluetoothAdapter();
    //   this.setData({
    //     isadapter: false
    //   })
    // }
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
     
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