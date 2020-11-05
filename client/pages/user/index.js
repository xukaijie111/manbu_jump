// pages/user/index.js

import {
  compThrottled
} from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  

  _clickMyDevice(){
    wx.navigateTo({
      url: '/pages/device-list/index',
    })
  },

  _clickMyList(){
    wx.navigateTo({
      url: '/pages/my-list/index',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.clickMyDevice = compThrottled(this._clickMyDevice.bind(this))
    this.clickMyList = compThrottled(this._clickMyList.bind(this))
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