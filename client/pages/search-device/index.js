// pages/search-device/index.js
import Ble from '../../utils/ble'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const mode = parseInt(options.mode);
    this.setData({mode})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  async onReady () {
    await Ble.findBleDevices();
    const timer = setInterval(()=>{
        if (Ble.lists.length) {
          this.setData({
            lists:Ble.lists
          })
          this.clearTimer()
        }
    },2000)
    this.setData({timer});
  },

  connectDeviceClick(e){
    const index = e.currentTarget.dataset.index;
    const deviceId = this.data.lists[index].deviceId;
    wx.showLoading({
      title: '连接中...',
    })
    Ble.connectDevice(deviceId)
    .then(()=>{
      wx.hideLoading()
      wx.redirectTo({
        url: `/pages/jump/index?mode=${this.data.mode}&deviceId=${deviceId}`,
      })
    },()=>{
      wx.hideLoading()
      wx.showToast({
        title: '连接失败',
      })
    })
  },

  clearTimer(){
    if (this.data.timer) {
      clearInterval(this.data.timer)
      this.setData({timer:null})
    }
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
    this.clearTimer();
    
    Ble.stopDiscoverBleDevice();
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