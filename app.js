//app.js
import API from './api/auth/index.js'
import router from "./router/index";

App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    API.Auth.login().then(v=>{
      API.Auth.getUser().then(v=>{
        if (v.roleIds.indexOf(201)>-1){
          API.Auth.getTeacher().then(v=>{
            this.globalData.userInfo = v;
            console.log('getTeacher');
            wx.navigateTo({
              url: router.questionList
            });
          })
        }else{
          API.Auth.getStudent().then(v => {
            this.globalData.userInfo = v;
            console.log('getStudent');
            wx.navigateTo({
              url: router.previewList
            });
          })
        }
      })
    }).catch(v=>{
      // wx.navigateTo({
      //   url: router.auth
      // });
    })
  },
  globalData: {
    userInfo: null
  }
})