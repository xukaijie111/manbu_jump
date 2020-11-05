//index.js
//获取应用实例
// import * as echarts from '../../ec-canvas/echarts';
const screenWidth = wx.getSystemInfoSync().screenWidth
import moment from '../../moment/index.js'
import Ble from '../../utils/ble'
import API from '../../request/api.js'
import Storage from '../../utils/storage.js'
import {
  compThrottled
} from '../../utils/util'
const app = getApp()

// var option = {
//   title:{
//     subtext: '卡路里',
//     subtextStyle: {          //对应样式
//       color: '#007947',
//       fontSize: 12
//     },
//   },
//   backgroundColor: "#ffffff",
//   xAxis: [
//     {
//       axisLabel: {
//         interval: 0,    //强制文字产生间隔
//         rotate: 45,     //文字逆时针旋转45°
//         textStyle: {    //文字样式
//           color: "#007947",
//           fontSize: 12,
//           fontFamily: 'Microsoft YaHei'
//         }
//       },
//       type: 'category',
//       data: [1, 2, 3, 4, 5, 6, 7, 8]        //待传入的参数result ，此为时间的横坐标，其实也是一个数组
//     }
//   ],
//   yAxis: [
//     {
//       axisLabel:{
//         textStyle: {    //文字样式
//           color: "#007947",
//           fontSize: 12,
//           fontFamily: 'Microsoft YaHei'
//         }
//       },
//       type: 'value',

//     }
//   ],
//   series: [
//     {
//       type: 'bar',
//       barWidth: 6,
//       itemStyle: {
//         normal: {
//           color: new echarts.graphic.LinearGradient(
//             0, 0, 0, 1,            // 0,0,1,0表示从左向右    0,0,0,1表示从右向左
//             [
//               { offset: 0, color: '#007947' },
//               { offset: 1, color: '#007947' }
//             ]),
//         }
//       },
//       data: [100, 200, 300, 400, 200, 100,90,90]     //待传入的参数others 
//     },
//   ]
// };
// function initChart(canvas, width, height, dpr) {
//   console.log('###canvas is ', canvas, width, height, dpr)

//   const chart = echarts.init(canvas, null, {
//     width: width,
//     height: height,
//     devicePixelRatio: dpr // new
//   });
//   canvas.setChart(chart);



//   chart.setOption(option, true);

//   return chart;
// }


Page({
  data: {
    todayCount:0,
    isLoad:false,
    screenWidth,
  
    lists:[
      {
        name:'次数',
        value:'--'
      },{
        name:'时间',
        value:'--'
      },{
        name:'卡路里',
        value:'--'
      }
    ],
    modeList:[
      {
        name:'自由跳',
        description:'畅享自由玩',
        url:'/images/free.png',
        color:'#f14545'
      },{
        name:'计时跳',
        description:'设置时间,挑战自己',
        url:'/images/time.png',
        color:'#f3f35d'
      },{
        name:'计数跳',
        description:'规定次数,突破自己',
        url:'/images/count.png',
        color:'#9fef9f'
      },
      {
        name:'竞技模式',
        description:'多人线上PK',
        url:'/images/pk.png',
        color:'#FF9800',
        type:'pk'
      }
    ]
  },

  getStastic(){
    API.getTodayInfo()
    .then((res)=>{
      var lists = this.data.lists;
      lists[0].value = res.jumpCount;
      lists[1].value = res.time;
      lists[2].value = res.ka
      this.setData({
        todayCount:res.count,
        lists
      })
    })
  },

  getUserInfo(e) {
    console.log('###e is ',e)
    const rawData = e.detail.rawData;
    if (rawData) {
      var userInfo = JSON.parse(rawData)
      Storage.userInfo = userInfo
      API.saveUserInfo({
        userInfo
      })
      this.setData({
        hasUserInfo:true
      })
      this.clickMode(e)
    }
  },

  login(){
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log('###login res is ', res)
        API.userLogin({
          code: res.code
        })
          .then((res) => {
            Storage.userId = res.userId
            this.setData({
              isLogin:true,
              hasUserInfo:!!res.userInfo
            })
            this.getStastic()
          })
      }
    })
  },

  onLoad: function () {
    this.clickMode = compThrottled(this._clickMode.bind(this))
   
  },

  onShow(){
      if (!this.data.isLogin) {
        this.login()
      }else{
        this.getStastic()
      }
  },

  _clickMode(e){
    const index = e.currentTarget.dataset.index;
    const item = this.data.modeList[index];
    if (item.type === 'pk'){
      wx.navigateTo({
        url: '/pages/pk/index',
      })
    }
    else{
      wx.navigateTo({
        url: `/pages/ready_jump/index?mode=${index}`,
      })
    }
   

    
  }
})
