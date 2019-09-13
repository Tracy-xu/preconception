import router from '../../../router/index.js';
import API from '../../../api/index.js';
import qs from '../../../utils/qs/index.js';

var sleep = time => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  })
};

Page({
  data: {
    visibleSelector: false,
    visibleSelectClass: false,
    queryParam: {
      curPage: 1,
      scope: 1,
      sortBy: 'created',
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

  onLoad() {
    this.getQuestion(this.data.queryParam).then((rep) => {
      var items = rep.items;
      var page = rep.page;
      this.data.questions.items = items;
      this.data.questions.page = page;

      this.setData({
        questions: this.data.questions
      });
    });
  },

  /**
   * 创建问题点击确定重新加载分页
   */
  async onShow() {
    if (this.data.needRefresh) {
      this.setData({
        needRefresh: false
      });

      await sleep(600);

      this.getQuestion(this.data.queryParam).then((rep) => {
        var items = rep.items;
        var page = rep.page;
        this.data.questions.items = items;
        this.data.questions.page = page;

        this.setData({
          questions: this.data.questions
        });
      });
    }
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

    this.getQuestion(this.data.queryParam).then((rep) => {
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
   * 查询前概念习题
   */
  getQuestion(param) {
    return new Promise((resolve, reject) => {
      param = qs(param);
      API.Question.getQuestion(param).then((rep) => {
        resolve(rep);
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
   * 选择学段学科教材章节查询习题
   */
  handleConfirmSelector(data) {
    this.setData({
      visibleSelector: false
    });

    var stgId = data.detail.stgId;
    var sbjId = data.detail.sbjId;
    var edtId = data.detail.edtId;
    var tbkId = data.detail.tbkId;
    var tbkNodeId = data.detail.tbkNodeId;
    var name = data.detail.name;
    var path = data.detail.path;

    this.setData({
      name,
      path,
      queryParam: Object.assign({}, this.data.queryParam, {
        stgId,
        sbjId,
        edtId,
        tbkId,
        tbkNodeId,
      })
    });

    this.getQuestion(this.data.queryParam).then((rep) => {
      var items = rep.items;
      var page = rep.page;
      this.data.questions.items = items;
      this.data.questions.page = page;

      this.setData({
        questions: this.data.questions
      });
    });
  },

  /**
   * 移除学段学科教材章节查询习题
   */
  handleRemoveChapterQueryParam() {
    this.setData({
      name: '',
      path: '',
      queryParam: Object.assign({}, this.data.queryParam, {
        stgId: '',
        sbjId: '',
        edtId: '',
        tbkId: '',
        tbkNodeId: ''
      })
    });

    this.getQuestion(this.data.queryParam).then((rep) => {
      var items = rep.items;
      var page = rep.page;
      this.data.questions.items = items;
      this.data.questions.page = page;

      this.setData({
        questions: this.data.questions
      });
    });
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
  async handleDeleteQuextion(ev) {
    var resId = ev.target.dataset.resid;
    await API.Question.deleteQuextion(resId);
    await sleep(600);

    this.getQuestion(this.data.queryParam).then((rep) => {
      var items = rep.items;
      var page = rep.page;
      this.data.questions.items = items;
      this.data.questions.page = page;

      this.setData({
        questions: this.data.questions
      });
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
   * 确定绑定班级
   */
  handleConfirmBindClass() {
    this.setData({
      visibleSelectClass: false
    });
  },

  /**
   * 编辑
   */
  handleEditQuestion(ev) {
    this.setData({
      resId: ev.target.dataset.resid,
      refId: ev.target.dataset.refid
    });

    wx.navigateTo({
      url: `${ router.questionEdit }?refId=${ this.data.refId }&resId=${ this.data.resId }`
    });
  }
})