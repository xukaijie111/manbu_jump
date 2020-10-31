// pages/ready_jump/index.js

// mode =0 自由条
// 1 计时条
// 2技术跳
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'JUMP_S10001',
    mode:'',
    hour:'0',
    minute:'30',
    count:100
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var index = parseInt(options.mode)
    this.setData({
      mode:index
    })
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