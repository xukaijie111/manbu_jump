// pages/device-list/index.js
import { BATTER_SERVICE, HUMAN_INERFACE_DEVICE_SERVICE,
  SCAN_PARAMETERS
 } from '../../utils/const.js'

 import API from '../../request/api.js'

 import {
  compThrottled
 } from '../../utils/util.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
     lists:[
       //{
    //   name:'jump s1'
    // },{
    //   name:'jump s2'ss
    // }
    ]
  },

  _bindDevice(){
    wx.navigateTo({
      url: '/pages/bind-device/index',
    })
  },

  getdeviceList(){
    API.getMyDeviceList()
    .then((res)=>{
      console.log('##3get device list is ',res)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.bindDevice = compThrottled(this._bindDevice.bind(this))
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getdeviceList();
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