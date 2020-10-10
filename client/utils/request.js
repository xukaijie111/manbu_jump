import {
  BASEHOST
} from './const.js'

const request = (url,data)=>{
  return new Promise((resolve,reject)=>{
    wx.request({
      url: BASEHOST+url,
      method:'POST',
      data,
      success:(res)=>{
        resolve(res.data)
      }
    })
  })
}
export const userLogin = (code)=>{
  return request('/users/login',{code})
}