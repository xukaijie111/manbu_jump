// pages/ready_jump/index.js

// mode =0 自由条
// 1 计时条
// 2技术跳
import Storage from '../../utils/storage'
import { compThrottled } from '../../utils/util';
import Ble from '../../utils/ble'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceId:'',
    name:'',
    mode:'',
    hour:'0',
    minute:'30',
    count:100,
    countArray:[
      50,
      100,
      300,
      500,
      1000,
      1500,
      2000,
      3000,
      4000,
      5000,
    ]
  },

  bindPickerChange(e) {
    const index = parseInt(e.detail.value);
    var count = this.data.countArray[index];
    this.setData({
      count
    })
    Storage.count = count
  },

  bindTimeChange: function(e) {
    let time = e.detail.value;
    const hour = time.split(':')[0]
    const minute = time.split(':')[1]
    this.setData({
      time,
      hour,
      minute,
    })
    Storage.hour = hour;
    Storage.minute = minute;
  },

  _clickSubmit(){
    const deviceId = this.data.deviceId;
    const mode = this.data.mode;
    wx.navigateTo({
      url: `/pages/jump/index?mode=${mode}&deviceId=${deviceId}`
    })
  },

  _connectClick(){
    wx.navigateTo({
      url: '/pages/search-device/index?mode='+ this.data.mode,
   })
  },

  getConnectDevice(){
    const lists = Ble.lists;
    if (lists.length) {
      this.setData({
        deviceId:lists[0].deviceId,
        name:lists[0].name
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var mode = parseInt(options.mode)
    var count = Storage.count || 100
    var hour = Storage.hour || 0
    var minute = Storage.minute || 30
    this.setData({
      mode:mode,
      hour,
      minute,
      count
    })

    this.clickSubmit = compThrottled(this._clickSubmit.bind(this))
    this.connectClick = compThrottled(this._connectClick.bind(this))
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
    this.getConnectDevice();
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