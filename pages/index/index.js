import router from '../../router/index.js';
import API from '../../api/demo/index.js';

//index.js
//获取应用实例
const app = getApp()

Page({
  onReady() {},
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    dialogShow: false,
    activeIndex:0,
    buttons: [{
      text: '登录'
    }],
    list: [{
        text: "前概念",
        pagePath: "index"
      },
      {
        text: "我的",
        pagePath: "mycenter"
      }
    ]
  },
  
  tabChange(e) {
    this.data.activeIndex = e.detail.index
  },
  onShow: function() {
    this.setData({
      dialogShow: true
    })
  },
  tapDialogButton(e) {
    this.setData({
      dialogShow: false,
      showOneButtonDialog: false
    })
  },
  //事件处理函数
  bindViewTap: function() {
    debugger;
    wx.navigateTo({
      url: `${router.logs}?aaaa=2`
    })
  },
  handleTouchStart() {
    wx.navigateTo({
      url: router.home
    });
  },
  onLoad: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})