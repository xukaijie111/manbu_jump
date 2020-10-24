

Page({
  data:{

  },
  onLoad(options){
    console.log('###options is ',options)
    const deviceId = options.deviceId;
    const name = options.name;
    this.setData({
      deviceId,
      name:name
    })
  }
})