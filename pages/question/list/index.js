import router from '../../../router/index.js';
import API from "../../../api/index.js"

var app = getApp();

Page({
  onReady() {
    console.log(app.globalData.myk_user);
    // API.Question.getQuestions();
  },

  /**
   * 页面的初始数据
   */
  data: {
    visibleSelector: false,
    queryParam: {
      curPage: 1
    }
  },

  /**
   * 查询前概念习题
   */
  getQuestion(param) {
    API.Question.getQuestion(param).then((rep) => {
      console.log(rep);
    });
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

    this.setData({
      queryParam: Object.assign({}, queryParam, {
        stgId: data.detail.stgId,
        sbjId: data.detail.sbjId,
        edtId: data.detail.edtId,
        tbkId: data.detail.tbkId,
        tbkNodeId: data.detail.tbkNodeId
      })
    });

    this.getQuestion(this.data.queryParam);
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