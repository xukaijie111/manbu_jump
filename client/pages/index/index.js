//index.js
//获取应用实例
import * as echarts from '../../ec-canvas/echarts';
const screenWidth = wx.getSystemInfoSync().screenWidth
import moment from '../../moment/index.js'
const app = getApp()

var option = {
  backgroundColor: "#ffffff",
  xAxis: [
    {
      type: 'category',
      data: [1, 2, 3, 4, 5, 6, 7, 8]        //待传入的参数result ，此为时间的横坐标，其实也是一个数组
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      type: 'bar',
      barWidth: 6,
      itemStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(
            0, 0, 0, 1,            // 0,0,1,0表示从左向右    0,0,0,1表示从右向左
            [
              { offset: 0, color: '#007947' },
              { offset: 1, color: '#007947' }
            ]),
        }
      },
      data: [100, 200, 300, 400, 200, 100,90,90]     //待传入的参数others 
    },
  ]
};
function initChart(canvas, width, height, dpr) {
  console.log('###canvas is ', canvas, width, height, dpr)

  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);



  chart.setOption(option, true);

  return chart;
}


Page({
  data: {
    isLoad:false,
    screenWidth,
    ec: {
      onInit: initChart
    }
  },

  onLoad: function () {
    var len = 7;

    var xDate = [];
   
   for (var i = len;i >= 0;i--) {
     var startDate = moment();
     xDate.push(startDate.subtract(i,'days').format('MM/DD'))
   }
   console.log('###date is ',xDate)
    option.xAxis[0].data = xDate;
    this.setData({isLoad:true})
  },
})
