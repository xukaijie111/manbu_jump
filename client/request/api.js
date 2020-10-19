import baseRequest from './baseRequest.js'

class API extends baseRequest {
  constructor(){
    super();
    this.data = [{
      apiName: "getMyDeviceList", method: 'post', url: "/users/login", showError: true
    },
      { apiName: 'userLogin', url: '/users/login', url:"/device/get_my_device_list"}
    ]
    this.initFuncs();
  }
}

export default new API();