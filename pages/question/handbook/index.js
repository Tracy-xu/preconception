import router from '../../../router/index.js';
import API from '../../../api/index.js';
import qs from '../../../utils/qs/index.js';

Page({
  data: {
    // 习题查询条件
    queryParam: {
      curPage: 1,
      scope: 2,
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
    pageTips: ''
  },

  async onLoad (options) {
    // 从习题列表带过来的学段学科教材章节默认值
    this.data.queryParam.stgId = options.stgId !== 'null' ? Number(options.stgId) : null;
    this.data.queryParam.sbjId = options.sbjId !== 'null' ? Number(options.sbjId) : null;
    this.data.queryParam.edtId = options.edtId !== 'null' ? Number(options.edtId) : null;
    this.data.queryParam.tbkId = options.tbkId !== 'null' ? Number(options.tbkId) : null;
    this.data.queryParam.tbkNodeId = options.tbkNodeId !== 'null' ? Number(options.tbkNodeId) : null;

    this.setData({
      queryParam: this.data.queryParam
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
  }
})