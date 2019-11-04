import router from '../../../router/index.js';
import API from '../../../api/index.js';
import qs from '../../../utils/qs/index.js';

Page({
  data: {
    visibleSelector: false,

    // 学段学科教材版本数据（部分在查询参数里面）
    nodeName: '',
    edtName: '',
    path: [],
    tbkName: '',

    // 习题查询条件
    queryParam: {
      curPage: 1,
      scope: 3,
      sortBy: 'created',
      stgId: null,
      sbjId: null,
      edtId: null,
      tbkId: null,
      tbkNodeId: null
    },
    // 习题列表
    questions: {
      items: [],
      page: {}
    },
    nodeName: '',
    pageTips: ''
  },

  async onLoad (options) {
    var res = await this.getTbkPreference();

    this.data.queryParam.stgId = res.stgId;
    this.data.queryParam.sbjId = res.sbjId;
    this.data.queryParam.edtId = res.edtId;
    this.data.queryParam.tbkId = res.tbkId;

    var edtName = '';
    var tbkName = '';
    var nodeName = '';
    var path = [];
    var tbkNodes = res.tbkNode;
    if (tbkNodes) {
      edtName = tbkNodes[0].attrs.edtName;
      tbkName = tbkNodes[0].attrs.tbkName;
      var hasPath = tbkNodes[0].path;
      if (hasPath) {
        path = tbkNodes[0].path;
        this.data.queryParam.tbkNodeId = path[path.length - 1].id;
        nodeName = path[path.length - 1].name;
      }
    }

    this.setData({
      queryParam: this.data.queryParam,
      edtName,
      tbkName,
      nodeName,
      path,
    });

    var rep = await this.getQuestion(this.data.queryParam);

    var items = rep.items;
    var page = rep.page;
    this.data.questions.items = items;
    this.data.questions.page = page;

    this.setData({
      questions: this.data.questions
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
   * 绑定班级
   */
  handleBindClass(ev) {
    var resId = ev.target.dataset.resid;
    var refId = ev.target.dataset.refid;

    wx.navigateTo({
      url: `${router.bindClass}?refId=${refId}&resId=${resId}`
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
    var nodeName = data.detail.nodeName;
    var edtName = data.detail.edtName;
    var tbkName = data.detail.tbkName;
    var path = data.detail.path;

    this.setData({
      nodeName,
      edtName,
      tbkName,
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
   * 获取数据偏好
   */
  getTbkPreference() {
    return API.Question.getTbkPreference();
  },
})