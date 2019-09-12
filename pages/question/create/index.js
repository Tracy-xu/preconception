import API from '../../../api/index.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    visibleSelector: false,

    // 表单操作相关数据
    content: '',
    imgs: [],
    audios: [],
    mode: 0,
    handleVisibleStemType: false,

    // 学段学科教材版本数据
    stgId: null,
    sbjId: null,
    tbkNodes: []
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
      queryParam: Object.assign({}, this.data.queryParam, {
        stgId: data.detail.stgId,
        sbjId: data.detail.sbjId,
        // edtId: data.detail.edtId,
        // tbkId: data.detail.tbkId,
        tbkNodeId: data.detail.tbkNodeId
      })
    });
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