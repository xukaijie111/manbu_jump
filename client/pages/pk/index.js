// pages/pk/index.js

import {
compThrottled
} from '../../utils/util'
import API from '../../request/api';
import Storage from '../../utils/storage'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:['','','','','','']
  },

  clickCallback(e) {
    console.log('back is ',e)
    const data = e.detail;
    let list = this.data.list;
    if (typeof data === 'number') {
      if (list[5] !== '') return ; //已经满了
      for (var i = 0; i<list.length;i++) {
        if (list[i] === '') {
          list[i] = data;
          break;
        }
      }
    }else if (data === 'del') {
      for (var j = list.length - 1;j>=0;j--) {
        if (list[j] !== '') {
          list[j] = ''
          break;
        }
      }
    } else if (data === 'OK') {
      for (var j = list.length - 1;j>=0;j--) {
        console.log('###',list[j])
        if (list[j] === '') {
         wx.showToast({
           title: '请输入竞技号',
           icon:'none'
         })
          return
        }
      }

      API.enterPkRoom({
        pkId:this.data.list.join(''),
        userInfo:Storage.userInfo
      })
      .then(()=>{
        wx.redirectTo({
          url: '/pages/pk-room/index',
        })
      })
   
      
    }
    
    this.setData({
      list
    })
  },

  _addPkRoom(){
    wx.navigateTo({
      url: '/pages/add-pk/index',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.addPkRoom = compThrottled(this._addPkRoom.bind(this))
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