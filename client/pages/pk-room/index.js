// pages/pk-room/index.js

import API from '../../request/api'
import Storage from '../../utils/storage'
import moment from '../../moment/index'

import {
  changeDate,
  compThrottled
} from '../../utils/util'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceInfo:''
  },

  _enterPk(){
    if (!this.data.deviceInfo) return;
    this.enterPkRoom()
    .then(()=>{
      this.getPkDetail()
    })
  },

  _leavePk(){
    API.leavePk({
      pkId:this.data.pkId
    })
    .then(()=>{
      this.getPkDetail();
    })
  },

  getPkDetail(){
    API.getPkDetail({
      pkId:this.data.pkId
    })
    .then((res)=>{
      var userId = Storage.userId;
      var userList = res.userList;
      let hasEnter = false;
      var userIds = userList.map((u)=>{return u.userId})
      if (userIds.indexOf(userId) === -1) {
        hasEnter = false
      }else{
        hasEnter =true
      }
      let modeStr = res.mode === 1?'计时跳':'计数跳';
      let maxSeconds = res.maxSeconds;
      let timeStr = changeDate(maxSeconds || 0);
      let maxCount = res.maxCount;
      this.setData({
        mode:res.mode,
        modeStr,
        timeStr,
        maxCount,
        userList,
        hasEnter
      })
    })
  },

  enterPkRoom(){
    return API.enterPk({
      userInfo:Storage.userInfo,
      pkId:this.data.pkId
    })
  },

  leavePkRoom(){
     API.leavePk()
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var pkId = options.pkId;
    this.setData({pkId})
    this.getPkDetail();
    this.enterPk = compThrottled(this._enterPk.bind(this))
    this.leavePk = compThrottled(this._leavePk.bind(this))
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
    this.leavePkRoom();
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