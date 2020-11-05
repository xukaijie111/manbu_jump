// pages/add-pk/index.js
import Storage from '../../utils/storage'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hour:'',
    minute:'',
    mode:1, // 1时间 2 //计数
    items: [
      {value: 1, name: '计时跳',checked:true},
      {value:2, name: '计数跳',checked:false},
    ],
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

  radioChange(e) {
    const value = e.detail.value;
    this.setData({
      mode:parseInt(value)
    })
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var count = Storage.count || 100
    var hour = Storage.hour || 0
    var minute = Storage.minute || 30
    this.setData({
      minute,count,hour
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