// pages/jump/components/time-mode/index.js
import moment from '../../../../moment/index.js'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
      time:{
        type:String,
        value:'',
        observer:function(newValue) {
          if (!newValue) return;
          var data = moment.duration(newValue, 'seconds')

          // 案例：时分秒 00:00:00
          var timeStr =  [data.hours(), data.minutes(), data.seconds()].map((n)=>this.formatNumber(n)).join(":")

          this.setData({
            timeStr
          })
        }
      },

  },

  /**
   * 组件的初始数据
   */
  data: {
    timeStr:'00:00:00'
  },

  /**
   * 组件的方法列表
   */
  methods: {
     formatNumber(n) {
      n = n.toString()
      return n[1] ? n : '0' + n
    }
  }
})
