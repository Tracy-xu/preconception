import API from '../../../api/index.js';
import chooseImage from '../../../utils/choose-image/choose-image.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    visibleSelector: false,
    visibleSelectClass: false,

    // 表单操作相关数据
    content: '',
    imgs: [],
    audios: [],
    mode: 0,
    handleVisibleStemType: false,

    // 学段学科教材版本数据
    stgId: null,
    sbjId: null,
    edtId: null,
    tbkId: null,
    path: [],

    // 绑定到班级所需参数
    refId: null,
    resId: null
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
      name: data.detail.name
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
    chooseImage().then((res) => {
      wx.uploadFile({
        url: 'http://122.112.239.223:8080/file/upload/image/binary',
        filePath: res[0],
        name: 'file',
        formData: {
          'user': 'test'
        },
        success(data) {

        }
      })
    });
  },

  /**
   * 添加语音
   */
  handleAddStemAudio() {
    wx.getRecorderManager();
  },

  /**
   * 选中答题方式
   */
  handleSelectAnswerType(ev) {
    this.setData({
      mode: ev.target.dataset.type
    });
  },

  /**
   * 保存创建习题
   */
  handleCreateQuestion() {
    this.createQuestion().then(() => {
      wx.navigateBack();
    });
  },

  /**
   * 创建习题
   */
  createQuestion() {
    return new Promise((resolve, reject) => {
      var param = {
        content: this.data.content,
        imgs: this.data.imgs,
        audios: this.data.audios,
        mode: this.data.mode,

        stgId: this.data.stgId,
        sbjId: this.data.sbjId,
        tbkNodes: [
          {
            attrs: {
              edtId: this.data.edtId,
              tbkId: this.data.tbkId
            },
            path: this.data.path.reverse()
          }
        ]
      };

      console.log(param, 222);

      // 调这个接口前，需要数据校验（学段学科教材章节必填）
      API.Question.createQuestion(param).then((res) => {
        resolve(res);
      });
    });
  },

  /**
   * 绑定班级
   */
  handleBindClass() {
    this.setData({
      visibleSelectClass: true
    });

    this.createQuestion().then((res) => {
      this.setData({
        resId: res.resId,
        refId: res.refId
      });
    });
  }
})