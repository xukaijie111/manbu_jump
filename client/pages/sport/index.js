// pages/sport/index.js
import {
  compThrottled
} from '../../utils/util.js'

import Ble from '../../utils/ble.js'
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

  async _clickJumpMode(){
    this.setData({
      selectDeviceShow: true
    })
    await Ble.findBleDevices();

    const timer = setInterval(()=>{
        this.setData({
          lists:Ble.lists
        })
    },2000)

    this.setData({timer})
  },

  async _connectBle(e) {
    console.log('connect e is ',e)
    const index = e.detail.index;
    wx.showLoading({
      title: '连接中...',
      mask:true
    })
    const deviceId = this.data.lists[index].deviceId;
    const name = this.data.lists[index].name

    try{
      await Ble.connectDevice(device);
      wx.hideLoading();
      wx.navigateTo({
        url: `/pages/jump/index?deviceId=${deviceId}&name=${name}`,
      })
    }catch(err) {
      console.log('###err')
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.clickJumpMode = compThrottled(this._clickJumpMode.bind(this))
    this.connectBle = compThrottled(this._connectBle.bind(this))
  },


  uninitBle() {
    if (this.data.timer) {
      clearInterval(this.data.timer)
      this.setData({
        timer:null
      })
    }

    Ble.stopDiscoverBleDevice();
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