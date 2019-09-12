import router from '../../../router/index.js';
import API from '../../../api/index.js';
import qs from '../../../utils/qs/index.js';

Page({
  onLoad() {
    this.getQuestion(this.data.queryParam);
  },

  /**
   * 页面的初始数据
   */
  data: {
    visibleSelector: false,
    queryParam: {
      curPage: 1,
      scope: 1
    },
    page: {}
  },

  /**
   * 查询前概念习题
   */
  getQuestion(param) {
    param = qs(param);
    API.Question.getQuestion(param).then((rep) => {
      this.setData({
        page: rep
      });
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
   * 学段学科教材章节组件自定义事件返回数据
   */
  handleConfirmSelector(data) {
    this.setData({
      visibleSelector: false
    });

    this.setData({
      queryParam: Object.assign({}, this.data.queryParam, {
        stgId: data.detail.stgId,
        sbjId: data.detail.sbjId,
        edtId: data.detail.edtId,
        tbkId: data.detail.tbkId,
        tbkNodeId: data.detail.tbkNodeId,
        name: data.detail.name
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

  /**
   * 创建习题
   */
  handleCreatQuestion() {
    wx.navigateTo({
      url: router.questionCreate
    });
  },

  /**
   * 删除习题
   */
  handleDeleteQuextion(ev) {
    var resId = ev.target.dataset.resid;
    API.Question.deleteQuextion(resId).then((res) => {
      setTimeout(() => {
        this.getQuestion(this.data.queryParam)
      }, 500);
    });
  }
})