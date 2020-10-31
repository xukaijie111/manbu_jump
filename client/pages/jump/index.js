
import Storage from '../../utils/storage'
Page({
  data:{
    mode:'',
    hour:'',
    minute:'',
    count:0,
    nowCount:0,
    ka:0,
    nowTime:'00:00'
  },

  onLoad(options){
    var index = parseInt(options.mode)
    var count = Storage.count || 100
    var hour = Storage.hour || 0
    var minute = Storage.minute || 30
    this.setData({
      mode:index,
      hour,
      minute,
      count
    })
  }
})