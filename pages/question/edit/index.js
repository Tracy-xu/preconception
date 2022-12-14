import API from '../../../api/index.js';
import chooseImage from '../../../utils/choose-image/choose-image.js';

const app = getApp();

Page({
  data: {
    visibleSelector: false,
    visibleBindClass: false,

    // 录音相关
    isRecord: false,
    RecorderManager: null,
    count: 0,
    timer: null,

    // 表单操作相关数据
    content: '',
    imgs: [],
    audios: [],
    mode: 0,
    visibleStemType: false,

    // 学段学科教材版本数据
    stgId: null,
    sbjId: null,
    edtId: null,
    tbkId: null,
    tbkNodeId: null,
    path: [],
    nodeName: '',
    edtName: '',
    tbkName: '',

    // 初始化绑定班级组件所需参数(refId、resId)
    resourceIds: [],
    refId: null,
    resId: null
  },

  onReady() {
    this.setData({
      RecorderManager: wx.getRecorderManager()
    });

    this.data.RecorderManager.onStop((res) => {
      API.Common.upload('audio', res.tempFilePath).then((data) => {
        this.setData({
          audios: [...this.data.audios, data.url]
        });
      });
    });

    this.setData({
      userInfo: app.globalData.userInfo
    });
  },
  
  onLoad: function (options) {
    var resId = options.resId;
    var refId = options.refId;
    // 从习题列表带过来的学段学科教材章节默认值
    var stgId = options.stgId !== 'null' ? Number(options.stgId) : this.data.stgId;
    var sbjId = options.sbjId !== 'null' ? Number(options.sbjId) : this.data.sbjId;
    var edtId = options.edtId !== 'null' ? Number(options.edtId) : this.data.edtId;
    var tbkId = options.tbkId !== 'null' ? Number(options.tbkId) : this.data.tbkId;
    var tbkNodeId = options.tbkNodeId !== 'null' ? Number(options.tbkNodeId) : this.data.tbkNodeId;
    var nodeName = options.nodeName;
    var edtName = options.edtName;
    var tbkName = options.tbkName;
    var path = options.path && JSON.parse(options.path);

    this.setData({
      resId,
      refId,
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

    this.getQuestionDetail(resId, refId);
  },

  /**
  * 查询习题详情
  */
  getQuestionDetail(resId, refId) {
    API.Question.getQuestionDetail(resId, refId).then((res) => {
      var content = res.content.content;
      var imgs = res.content.imgs;
      var audios = res.content.audios;
      var mode = res.content.mode;
      var sbjId = res.content.sbjId;
      var stgId = res.content.stgId;

      this.setData({
        content,
        imgs,
        audios,
        mode,

        sbjId,
        stgId
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
      edtName: data.detail.edtName,
      nodeName: data.detail.nodeName,
      tbkName: data.detail.tbkName
    });
  },

  /**
   * 显示第一个添加题干弹层
   */
  handleVisibleStemType() {
    this.setData({
      visibleStemType: !this.data.visibleStemType
    });
  },

  /**
   * 输入文本内容
   */
  handleInputContent(ev) {
    this.setData({
      content: ev.detail.value
    });
  },

  /**
   * 添加图片
   */
  handleAddStemImg() {
    this.setData({
      visibleStemType: false
    });

    chooseImage().then((res) => {
      API.Common.upload('image', res[0]).then((data) => {
        this.setData({
          imgs: [...this.data.imgs, data.url]
        });
      });
    });
  },

  /**
   * 删除图片
   */
  handleDeleteImg(ev) {
    var index = ev.target.dataset.index;
    this.data.imgs.splice(index, 1);
    this.setData({
      imgs: this.data.imgs
    });
  },

  /**
   * 添加语音
   */
  handleAddStemAudio() {
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
    this.data.audios.splice(index, 1);
    this.setData({
      audios: this.data.audios
    });
  },

  /**
   * 修改父页面习题列表查询条件
   */
  updateQueryParamParentPage() {
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
      edtName,
      tbkName,
      nodeName
    });
  },

  /**
   * 保存创建习题
   */
  async handleCreateQuestion() {
    // 校验必填（学段学科教材章节、题干、答题方式）
    if (!this.data.stgId) {
      wx.showToast({
        title: '请选择学段学科教程章节',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    if (!this.data.content) {
      wx.showToast({
        title: '请输入题目内容',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    await this.createQuestion();
    this.updateQueryParamParentPage();

    wx.showModal({
      title: '提示',
      content: '编辑成功',
      showCancel: false,
      success: async (res) => {
        wx.navigateBack();
      }
    });
  },

  /**
   * 创建习题
   */
  createQuestion() {
    var tbkNodes = null;
    if (this.data.edtId) {
      tbkNodes = [{}];
      tbkNodes[0].attrs = {
        edtId: this.data.edtId,
        tbkId: this.data.tbkId,
        edtName: this.data.edtName,
        tbkName: this.data.tbkName
      };
    }

    if (this.data.path.length) {
      tbkNodes[0].path = this.data.path;
    }

    var param = {
      content: this.data.content,
      imgs: this.data.imgs,
      audios: this.data.audios,
      mode: this.data.mode,

      stgId: this.data.stgId,
      sbjId: this.data.sbjId,
      tbkNodes: tbkNodes
    };

    // 重新编辑时，resId、refId 这两个参数也要传过去
    return API.Question.createQuestion('EDIT', param, this.data.resId, this.data.refId);
  },

  /**
   * 绑定班级
   */
  async handleBindClass() {
    var res = await this.createQuestion();
    var resourceIds = [{
      resId: res.resId,
      refId: res.refId
    }];
 
    // 一个班级时直接绑定
    if (this.data.userInfo.klasses.length === 1) {
      var klassIds = [this.data.userInfo.klasses[0].id];
      API.Question.bindClassBulk({ klassIds, resourceIds }).then(() => {
        wx.showModal({
          title: '提示',
          content: '绑定成功',
          showCancel: false,
          success: async (res) => {
            wx.navigateBack();
          }
        });
      });
      return;
    }

    // 多个班级到一个新弹框选择绑定
    this.setData({
      resourceIds,
      visibleBindClass: true
    });
  },

  /**
   * 确定绑定班级
   */
  handleConfirmBindClass() {
    this.updateQueryParamParentPage();

    wx.showModal({
      title: '提示',
      content: '绑定成功',
      showCancel: false,
      success: async (res) => {
        wx.navigateBack();
      }
    });
  },

  /**
   * 取消绑定班级
   */
  handleCancelBindClass() {
    this.updateQueryParamParentPage();
    wx.navigateBack();
  },

  /**
   * 取消
   */
  handleCancel() {
    wx.navigateBack();
  }
})