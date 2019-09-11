import API from '../../../api/index.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '',
    imgs: [],
    audios: [],
    mode: 0,
    handleVisibleStemType: false
  },

  /**
   * 显示第一个添加题干弹层
   */
  handleVisibleStemType() {
    this.setData({
      handleVisibleStemType: !this.data.handleVisibleStemType
    });
  },

  /**
   * 创建习题
   */
  createQuestion(param) {
    API.Question.createQuestion(param);
  }
})