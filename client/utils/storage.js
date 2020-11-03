
var _Storage = {
  phone: {
    sync: true
  },
  idToken: {
    sync: true
  },
  userId:{
    sync:true
  }
}

var Storage = new Proxy(_Storage, {
  get(target, key) {
    return wx.getStorageSync(key)
  },
  set(target, key, value) {
    if (target[key] && target[key].sync) {
      wx.setStorageSync(key, value)
    } else {
      wx.setStorage({ key, data: value })
    }
    return true
  }
})

export default Storage
