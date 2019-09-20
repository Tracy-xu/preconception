import API from '../../../api/index.js';
import chooseImage from '../../../utils/choose-image/choose-image.js';

Page({
  data: {
    visibleSelector: false,
    visibleBindClass: false,

    // 录音相关
    isRecord: false,
    RecorderManager: null,
    count: 0,
    timer: null,
    recordIndex: null,

    // 生产的数据
    qsData: null,

    // 学段学科教材版本数据
    stgId: null,
    sbjId: null,
    edtId: null,
    tbkId: null,
    tbkNodeId: null,
    path: [],
    nodeName: '',
    edtName: '',

    // 初始化绑定班级组件所需参数(refId、resId)
    resourceIds: []
  },

  onLoad: function (options) {
    // 从习题列表带过来的学段学科教材章节默认值
    var stgId = options.stgId !== 'null' ? Number(options.stgId) : this.data.stgId;
    var sbjId = options.sbjId !== 'null' ? Number(options.sbjId) : this.data.sbjId;
    var edtId = options.edtId !== 'null' ? Number(options.edtId) : this.data.edtId;
    var tbkId = options.tbkId !== 'null' ? Number(options.tbkId) : this.data.tbkId;
    var tbkNodeId = options.tbkNodeId !== 'null' ? Number(options.tbkNodeId) : this.data.tbkNodeId;
    var nodeName = options.nodeName;
    var edtName = options.edtName;
    var tbkName = options.tbkName;
    var path = JSON.parse(options.path);

    this.setData({
      stgId,
      sbjId,
      edtId,
      tbkId,
      tbkNodeId,
      nodeName,
      edtName,
      tbkName,
      path
    });
  },

  onReady() {
    this.initQsData();

    this.setData({
      RecorderManager: wx.getRecorderManager()
    });

    this.data.RecorderManager.onStop((res) => {
      API.Common.upload('audio', res.tempFilePath).then((data) => {
        this.data.qsData[this.data.recordIndex].audios = [...this.data.qsData[this.data.recordIndex].audios, data.url];

        this.setData({
          qsData: this.data.qsData
        });
      });
    });
  },

  /**
   * 初始化表单数据结构
   */
  initQsData() {
    var qsData = [];
    for (var i = 0; i < 3; i++) {
      qsData.push({
        content: '',
        imgs: [],
        audios: [],
        mode: 0,
        visibleStemType: false,
      });
    }

    this.setData({
      qsData
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
      stgId: data.detail.stgId,
      sbjId: data.detail.sbjId,
      edtId: data.detail.edtId,
      tbkId: data.detail.tbkId,
      tbkNodeId: data.detail.tbkNodeId,
      path: data.detail.path,
      nodeName: data.detail.nodeName,
      edtName: data.detail.edtName,
      tbkName: data.detail.tbkName
    });
  },

  /**
   * 显示添加附件弹层
   */
  handleVisibleStemType(ev) {
    var index = ev.target.dataset.index;
    this.data.qsData[index].visibleStemType = !this.data.qsData[index].visibleStemType;

    this.setData({
      qsData: this.data.qsData
    });
  },

  /**
   * 输入文本内容
   */
  handleInputContent(ev) {
    var index = ev.target.dataset.index;

    this.data.qsData[index].content = ev.detail.value;

    this.setData({
      qsData: this.data.qsData
    });
  },

  /**
   * 添加图片
   */
  handleAddStemImg(ev) {
    var index = ev.target.dataset.index;
    this.data.qsData[index].visibleStemType = false;

    this.setData({
      qsData: this.data.qsData
    });

    chooseImage().then((res) => {
      API.Common.upload('image', res[0]).then((data) => {
        this.data.qsData[index].imgs = [...this.data.qsData[index].imgs, data.url];

        this.setData({
          qsData: this.data.qsData
        });
      });
    });
  },

  /**
   * 删除图片
   */
  handleDeleteImg(ev) {
    var index = ev.target.dataset.index;
    var idx = ev.target.dataset.idx;
    this.data.qsData[index].imgs.splice(idx, 1);

    this.setData({
      qsData: this.data.qsData
    });
  },

  /**
   * 添加语音
   */
  handleAddStemAudio(ev) {
    this.setData({
      recordIndex: ev.target.dataset.index
    });

    if (!this.data.isRecord) {
      this.setData({
        isRecord: true
      });

      this.data.RecorderManager.start({
        format: 'mp3'
      });

      var count = 0;
      var timer = null;
      timer = setInterval(() => {
        count += 1;
        this.setData({
          count
        });
      }, 1000);

      this.setData({
        timer
      });
    } else {
      this.setData({
        isRecord: false,
        visibleStemType: false
      });

      clearInterval(this.data.timer);

      this.setData({
        timer: null,
        count: 0
      });

      this.data.RecorderManager.stop();
    }
  },

  /**
   * 删除语音
   */
  handleDeleteAudio(ev) {
    var index = ev.target.dataset.index;
    var idx = ev.target.dataset.idx;

    this.data.qsData[index].audios.splice(idx, 1);

    this.setData({
      qsData: this.data.qsData
    });
  },

  /**
   * 选中答题方式
   */
  handleSelectAnswerType(ev) {
    var index = ev.target.dataset.index;

    var mode = ev.target.dataset.type;
    if (this.data.qsData[index].mode === mode) {
      this.data.qsData[index].mode = 0;
    } else {
      this.data.qsData[index].mode = mode;
    }
    
    this.setData({
      qsData: this.data.qsData
    });
  },

  /**
   * 修改父页面习题列表查询查询条件
   */
  addNewQuestionToParentPage() {
    var nodeName = '';
    var edtName = '';
    var tbkName = '';
    var queryParam = {
      curPage: 1,
      scope: 1,
      sortBy: 'created',
      stgId: this.data.stgId,
      sbjId: this.data.sbjId,
    };

    if (this.data.edtId && this.data.tbkId && this.data.tbkNodeId) {
      queryParam.edtId = this.data.edtId;
      queryParam.tbkId = this.data.tbkId;
      queryParam.tbkNodeId = this.data.tbkNodeId;
      nodeName = this.data.nodeName;
      edtName = this.data.edtName;
      tbkName = this.data.tbkName;

    } else {
      queryParam.edtId = null;
      queryParam.tbkId = null;
      queryParam.tbkNodeId = null;
    }

    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      reload: true,
      queryParam,
      nodeName,
      edtName,
      tbkName
    });
  },

  /**
   * 保存创建习题
   */
  async handleCreateQuestion() {
    await this.createQuestion();
    this.addNewQuestionToParentPage();

    wx.showModal({
      title: '提示',
      content: '创建成功，需要继续创建问题吗？',
      success: async (res) => {
        if (res.cancel) {
          wx.navigateBack();
          return;
        }

        this.initQsData();
      }
    });
  },

  /**
   * 创建习题
   */
  createQuestion() {
    // 学段学科教材章节，必填
    if (!this.data.stgId) {
      wx.showToast({
        title: '请选择学段学科教程章节',
        icon: 'none',
        duration: 2000
      });
      return Promise.reject();
    }

    // 题干、答题方式，可以整个不填，但是一旦填了一个，都要填
    var tips = '';
    var miss = false;
    this.data.qsData.forEach((item) => {
      if ((item.content && !item.mode) || (!item.content && item.mode)) {
        tips = '请输入题干和答题方式'
        miss = true;
        return;
      }
    });
    // 三个都没填
    var empty = this.data.qsData.every((item) => {
      return !item.content && !item.mode;
    });
    if (empty) {
      tips = '请新建题目';
    }

    if (miss || empty) {
      wx.showToast({
        title: tips,
        icon: 'none',
        duration: 2000
      });
      return Promise.reject();
    }

    // 处理数据
    var tbkNodes = null;
    if (this.data.edtId && this.data.path.length) {
      tbkNodes = [{}];
      tbkNodes[0].attrs = {
        edtId: this.data.edtId,
        tbkId: this.data.tbkId,
        edtName: this.data.edtName,
        tbkName: this.data.tbkName
      };
      tbkNodes[0].path = this.data.path;
    }

    var param = [];
    this.data.qsData.forEach((item) => {
      if (!item.content || !item.mode) {
        return;
      }

      item.stgId = this.data.stgId;
      item.sbjId = this.data.sbjId;
      item.tbkNodes = tbkNodes;

      param.push(item);
    });

    return API.Question.createQuestionBulk('ADD', param);
  },

  /**
   * 绑定班级
   */
  async handleBindClass() {
    var res = await this.createQuestion();

    var resourceIds = [];
    res.forEach((item, index) => {
      resourceIds.push({
        resId: item.resId,
        refId: item.refId
      });
    });

    this.setData({
      resourceIds,
      visibleBindClass: true
    });
  },

  /**
   * 确定绑定班级
   */
  handleConfirmBindClass() {
    wx.showModal({
      title: '提示',
      content: '绑定成功，需要继续创建问题吗？',
      success: async (res) => {
        if (res.cancel) {
          this.addNewQuestionToParentPage();
          wx.navigateBack();
          return;
        }

        this.setData({
          visibleBindClass: false
        });
        this.initQsData();
      }
    });
  },

  /**
   * 取消绑定班级
   */
  handleCancelBindClass() {
    this.addNewQuestionToParentPage();
    wx.navigateBack();
  },

  /**
   * 取消
   */
  handleCancel() {
    wx.navigateBack();
  }
})