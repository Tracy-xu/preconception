import router from '../../../router/index.js';
import API from '../../../api/index.js';
import qs from '../../../utils/qs/index.js';

var sleep = time => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

Page({
  data: {
    visibleSelector: false,

    // 学段学科教材版本数据（部分在查询参数里面）
    nodeName: '',
    edtName: '',
    path: [],
    tbkName: '',
    
    // 分页数据
    queryParam: {
      curPage: 1,
      scope: 1,
      sortBy: 'created',
      stgId: null,
      sbjId: null,
      edtId: null,
      tbkId: null,
      tbkNodeId: null
    },
    pageTips: '',
    questions: {
      items: [],
      page: {}
    },
    reload: false,

    // 绑定班级所需参数
    resId: null,
    refId: null
  },

  async onLoad() {
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

    this.data.queryParam.curPage = 1;
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
   * 创建、编辑问题点击确定重新加载分页
   */
  async onShow() {
    if (this.data.reload) {
      this.setData({
        reload: false
      });

      // 查询条件变了，要重查（单纯插入数据解决不了问题）
      // await sleep(1000);

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
   * 移除学段学科教材章节查询习题
   */
  handleRemoveChapterQueryParam() {
    this.setData({
      nodeName: '',
      path: [],
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
    var stgId = this.data.queryParam.stgId;
    var sbjId = this.data.queryParam.sbjId;
    var edtId = this.data.queryParam.edtId;
    var tbkId = this.data.queryParam.tbkId;
    var tbkNodeId = this.data.queryParam.tbkNodeId;
    var nodeName = this.data.nodeName;
    var edtName = this.data.edtName;
    var tbkName = this.data.tbkName;
    var path = JSON.stringify(this.data.path);

    wx.navigateTo({
      url: `${ router.questionCreate }?stgId=${ stgId }&sbjId=${ sbjId }&edtId=${ edtId }&tbkId=${ tbkId }&tbkNodeId=${ tbkNodeId }&nodeName=${ nodeName }&edtName=${ edtName }&tbkName=${ tbkName }&path=${ path }`
    });
  },

  /**
   * 删除习题
   */
  handleDeleteQuextion(ev) {
    var resId = ev.target.dataset.resid;
    var index = ev.target.dataset.index;

    wx.showModal({
      title: '提示',
      content: '确定删除吗？',
      success: async (res) => {
        if (res.cancel) {
          return;
        }

        await API.Question.deleteQuextion(resId);

        this.data.questions.items.splice(index, 1);
        this.data.questions.page.total = this.data.questions.page.total - 1;
        this.setData({
          questions: this.data.questions
        });
      }
    });
  },

  /**
   * 绑定班级
   */
  handleBindClass(ev) {
    var resId = ev.target.dataset.resid;
    var refId = ev.target.dataset.refid;

    wx.navigateTo({
      url: `${ router.bindClass }?refId=${ refId }&resId=${ resId }`
    });
  },

  /**
   * 编辑
   */
  handleEditQuestion(ev) {
    var content = ev.target.dataset.content;

    var resId = ev.target.dataset.resid;
    var refId = ev.target.dataset.refid;

    var stgId = content.stgid;
    var sbjId = content.sbjid;
    if (content.tbkNodes) {
      var edtId = content.tbkNodes[0].attrs.edtId;
      var tbkId = content.tbkNodes[0].attrs.tbkId;
      var tbkNodeId = content.tbkNodes[0].path[content.tbkNodes[0].path.length - 1].id;
      var nodeName = content.tbkNodes[0].path[content.tbkNodes[0].path.length - 1].name;
      var edtName = content.tbkNodes[0].attrs.edtName;
      var tbkName = content.tbkNodes[0].attrs.tbkName;
      var path = JSON.stringify(content.tbkNodes[0].path);
    }

    wx.navigateTo({
      url: `${ router.questionEdit }?refId=${ refId }&resId=${ resId }&stgId=${ stgId }&sbjId=${ sbjId }&edtId=${ edtId }&tbkId=${ tbkId }&tbkNodeId=${ tbkNodeId }&nodeName=${ nodeName }&edtName=${ edtName }&tbkName=${ tbkName }&path=${ path }`
    });
  },

  /**
   * 获取数据偏好
   */
  getTbkPreference() {
    return API.Question.getTbkPreference();
  }
})