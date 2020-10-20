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
      {
        name:'jump s1'
      },{
        name:'jump s2'
      }
    ],
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
    this.setData({
      selectDeviceShow:false
    })
  },

  _clickJumpMode(){
    this.setData({
      selectDeviceShow: true
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.clickJumpMode = compThrottled(this._clickJumpMode.bind(this))
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