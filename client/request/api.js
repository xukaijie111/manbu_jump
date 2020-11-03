import baseRequest from './baseRequest.js'

class API extends baseRequest {
  constructor(){
    super();
    this.data = [{
      apiName: "getMyDeviceList", method: 'post', url: "/device/get_my_device_list", showError: true
    },
      { apiName: 'userLogin', url: '/users/login', url:"/users/login"},
      {
        apiName: 'createGame', url: '/game/create_game', showLoading: true, loadContent:'正在配置服务器...',showError:true
      },
      {
        apiName: 'updateGame', url:"/game/update_game"
      },
      {
        apiName: 'endGame', url: '/game/end_game', showLoading: true, loadContent: '正在保存数据...'
      },
      {
        apiName: 'getTodayInfo', url:'/index/get_today_info'
      }
    ]
    this.initFuncs();
  }
}

export default new API();