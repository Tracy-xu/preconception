import router from '../../../router/index.js';
import API from "../../../api/index.js"

Page({
  onReady() {
    // API.Question.getQuestions();
  },

  /**
   * 页面的初始数据
   */
  data: {
    visibleSelector: false,
  },

  /**
   * 显示学段学科教材章节组件 
   */
  handleVisibleSelector() {
    this.setData({
      visibleSelector: true
    });
  },

  /**
   * 取消学段学科教材章节组件
   */
  handleCloseSelector() {
    this.setData({
      visibleSelector: false
    });
  },

  /**
   * 确定学段学科教材章节组件
   */
  handleConfirmSelector(data) {
    this.setData({
      visibleSelector: false
    });

    console.log(data);
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
  },

  toCreatQuestion() {
    console.log("ddd")
    wx.navigateTo({
      url: router.questionCreate
    });
  }
})