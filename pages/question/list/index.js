import router from '../../../router/index.js';
import API from '../../../api/index.js';
import qs from '../../../utils/qs/index.js';

Page({
  onLoad() {
    this.getQuestion(this.data.queryParam);
  },

  /**
   * 创建问题点击确定重新加载分页
   */
  onShow() {
    if (this.data.needRefresh) {
      debugger;
      this.getQuestion(this.data.queryParam);

      this.setData({
        needRefresh: false
      });
    }
  },

  /**
   * 页面的初始数据
   */
  data: {
    visibleSelector: false,
    visibleSelectClass: false,
    queryParam: {
      asc: false,
      curPage: 1,
      scope: 1
    },
    pageTips: '',
    questions: {
      items: [],
      page: {}
    },
    needRefresh: false,

    // 绑定班级所需参数
    resId: null,
    refId: null
  },

  /**
   * 分页查询前概念习题
   */
  handlePageChange() {
    var curPage = this.data.queryParam.curPage + 1;
    var totalPage = Math.ceil(this.data.questions.page.total / this.data.questions.page.pageSize);

    if (curPage > totalPage) {
      curPage = totalPage;

      this.setData({
        pageTips: '没有更多数据'
      });

      return;
    }

    this.setData({
      pageTips: '加载中'
    });

    this.setData({
      queryParam: Object.assign({}, this.data.queryParam, {
        curPage: curPage
      })
    });

    this.getQuestion(this.data.queryParam);
  },

  /**
   * 查询前概念习题
   */
  getQuestion(param) {
    param = qs(param);
    API.Question.getQuestion(param).then((rep) => {
      var items = this.data.questions.items.concat(rep.items);
      var page = rep.page;
      this.data.questions.items = items;
      this.data.questions.page = page;

      this.setData({
        questions: this.data.questions
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
  },

  /**
   * 绑定班级
   */
  handleBindClass(ev) {
    this.setData({
      resId: ev.target.dataset.resid,
      refId: ev.target.dataset.refid
    });

    this.setData({
      visibleSelectClass: true
    });
  },

  /**
   * 确定版本
   */
  handleConfirmBindClass() {
    this.setData({
      visibleSelectClass: false
    });
  }
})