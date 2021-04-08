
import {
  object2String,
} from '../utils/util'

import {
  BASEAPIURL
} from '../utils/const.js'

import Storage from '../utils/storage.js'

/*
param: {
  url,
  query, url 后面参数
  data,body 参数
}
*/
let loadCount = 0;
export default class RequestBaseComponent {
  constructor() {
    this._fetch = this._fetch.bind(this);
    this.deviceNo = '';
    this.cookie = ''
  }


  _fetch(param) {
    let _this = this;
    return new Promise((resolve, reject) => {
      if (param.query) {
        let url = param.url;
        url = url + '?' + object2String(param.query);
        param.url = url;
      }
      if (Storage.userId) {
        if (param.data) param.data.userId = Storage.userId
        else{
          param.data = {
            userId:Storage.userId
          }
        }
        
      }

      wx.request({
        ...param,
        success: (res) => {
          const data = res.data;
          if (data.code === 0) {
            resolve(data.data)
          }else{
            reject(data)
          }
        },
        fail: (err) => {
          console.log(err);
          // wx.showModal({
          //   title: '提示',
          //   content: '请求发生错误,可能是网络断开链接，请检查网络',
          //   showCancel:false,
          //   confirmText:'知道了',
          //   confirmColor:'#0076FF',
          // })
          reject(err);
        }
      })

    })
  }

  showloading(content) {
    if (loadCount === 0) {
      loadCount++;
      wx.showLoading({
        title: content,
        mask: true
      })
    }
  }

  hideloading() {
    if (loadCount !== 0) {
      wx.hideLoading();
      loadCount = 0;
    }
  }
  initFuncs() {
    let _this = this;

    for (const item of this.data) {
      this[item.apiName] = function (data, query,isLoading = true,showError = true) {
        let func = _this._fetch;
        let param = { url: BASEAPIURL + item.url, method: item.method || 'POST' }
        if (data) param.data = data;
        if (query) param.query = query;
        let timer = null;
        if (item.showLoading && isLoading) {
          timer = setTimeout(() => {
            _this.showloading(item.loadContent || '加载中...')
          }, 200)
        }
        return func(param)
          .then((res) => {
            if (timer && item.showLoading) {
              clearTimeout(timer);
              _this.hideloading();
            }

            return Promise.resolve(res);
          }, (err) => {
            console.log('#1111',err);
            if (timer) {
              clearTimeout(timer);
              _this.hideloading();
            }

          if (item.showError && err && err.message && showError) {
            wx.showToast({
              title: err.message || '失败',
              icon: "none",
              duration:2500
            });
          }
          return Promise.reject(err);
            

          })
      }
    }
  }
}
