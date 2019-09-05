import router from '../../../router/index.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 切换 tabbar
   */
  handleTabChange(data) {
    const index = data.detail.index;
 
    if (index === 1) {
      wx.navigateTo({
        url: router.profile
      });
    }
  }
})