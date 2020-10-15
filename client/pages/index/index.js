//index.js
//获取应用实例
const app = getApp()


Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  discoveryBLE(){
    wx.getBluetoothDevices({
      success:(res)=>{
        console.log('####find device is ',res.devices)
      }
    })
  },

  findBLE:function(){
    wx.startBluetoothDevicesDiscovery({
      success: (res)=> {
        wx.showLoading({
           title: '正在搜索设备',
           mask:true
         })

         const timer = setInterval(()=>{
           this.discoveryBLE()
         },1000)

         setTimeout(()=>{
           clearInterval(timer)
           wx.hideLoading()
         },5*1000)

      },
    })
  },
  initBLE: function () {
    wx.openBluetoothAdapter({
      success: (res) => {
        console.log('打开蓝牙适配成功',res)
        this.findBLE();
      },
      fail:(err)=>{
        wx.showToast({
          title: '请打开蓝牙',
          icon:'none'
        })
      }
    })
  },

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.initBLE();
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
