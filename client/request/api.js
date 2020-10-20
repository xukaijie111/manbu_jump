import baseRequest from './baseRequest.js'

class API extends baseRequest {
  constructor(){
    super();
    this.data = [{
      apiName: "getMyDeviceList", method: 'post', url: "/device/get_my_device_list", showError: true
    },
      { apiName: 'userLogin', url: '/users/login', url:"/users/login"}
    ]
    this.initFuncs();
  }
}

export default new API();