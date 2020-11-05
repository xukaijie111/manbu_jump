import baseRequest from './baseRequest.js'

class API extends baseRequest {
  constructor(){
    super();
    this.data = [{
      apiName: "getMyDeviceList", method: 'post', url: "/device/get_my_device_list", showError: true
    },
      { apiName: 'userLogin', url: '/users/login', url:"/users/login"},
      {
        apiName:'saveUserInfo',url:'/users/save_info'
      },
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
      },
      {
        apiName:'enterPkRoom',url:'/pk/enter_pk',showLoading: true, loadContent: '正在进入房间..',showError:true
      },{
        apiName:'createPk',url:'/pk/create_pk',showLoading: true, loadContent: '正在创建房间..',showError:true
      },
      {
        apiName:'getPkDetail',url:'/pk/get_pk_detail',showLoading: true
      },
      {
        apiName:'enterPk',url:'/pk/enter_pk',
      },{
        apiName:'leavePk',url:'/pk/leave_pk'
      }
    ]
    this.initFuncs();
  }
}

export default new API();