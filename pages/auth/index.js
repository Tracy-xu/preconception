import router from '../../router/index.js';
import API from '../../api/index.js';

//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    buttons: [{
      text: '登录'
    }],
    password:null,
    username:null
  },

  usernameHander(event){
    this.setData({ 'username':event.detail.value});
  },
  passwordHander(event){
    this.setData({ 'password': event.detail.value });
  },

  /**
   * 登录
   */
  handleLogin() {
    API.Auth.login(this.data.username, this.data.password).then(v=>{
      API.Auth.getUser().then(v=>{
        if (v.roleIds.indexOf(201)>-1){
          API.Auth.getTeacher().then(v=>{
            app.globalData.myk_user = v;
            wx.navigateTo({
              url: router.questionList
            });
          })
        }else{
          API.Auth.getStudent().then(v => {
            app.globalData.myk_user = v;
            wx.navigateTo({
              url: router.previewList
            });
          })
        }
      })
    })
  }
});