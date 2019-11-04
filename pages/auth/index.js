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
      text: '确认绑定'
    }],
    password:null,
    username:null,
    showGetInfo:true,
    showLogin:false,
    image:null,
  },
  onLoad: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);
    API.Auth.login().then(v=>{
      this.loginSuccess();
    }).catch(v=>{
      console.log('showLogin',this.data.showLogin);
      this.setData({'showLogin':true});
    });
    // wx.getUserInfo({
    //   success: (res)=>{
    //     this.setData({ 'showGetInfo': false,image: res.userInfo.avatarUrl});
    //   },
    //   fail:(res)=>{
    //     this.setData({ 'showGetInfo': true});
    //   }
    // });
  },
  bindGetUserInfo (e) {
    this.setData({ 'showGetInfo': false});
  },
  usernameHander(event){
    this.setData({ 'username':event.detail.value});
  },
  passwordHander(event){
    this.setData({ 'password': event.detail.value });
  },
  handleLogin() {
    API.Auth.login(this.data.username, this.data.password).then(v=>{
      this.loginSuccess();
    })
  },
  loginSuccess(){
    API.Auth.getUser().then(v=>{
      if (v.roleIds.indexOf(201) > -1) {
        API.Auth.getTeacher().then(v => {
          app.globalData.userInfo = v;
          wx.redirectTo({
            url: router.arrangementRecord
          });
        })
      } else {
        API.Auth.getStudent().then(v => {
          app.globalData.userInfo = v;
          wx.redirectTo({
            url: router.previewList
          });
        })
      }
    })
  },
});