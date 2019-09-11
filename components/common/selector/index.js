import API from '../../../api/index.js';

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    visibleVersion: false,
    visibleChapter: false,

    // 学段
    stage: [],
    selectedStgId: null,

    // 学科
    subject: [],
    relativeSubject: [],
    selectedSbjId: null,

    // 版本和课本
    tempEdtName: '',
    tempTbkName: '',
    tempTbkId: null,
    selectedEdtName: '',
    selectedTbkName: '',
    selectedTbkId: null,

    // 章节
    tempNodeName: '',
    tempNodeId: null,
    selectedNodeName: '',
    selectedNodeId: null,
    treeData: null
  },

  ready() {
    this.getStage();
    this.getSubject();
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 查询学段
     */
    getStage() {
      API.Question.getStage().then((rep) => {
        this.setData({
          stage: rep
        });
      });
    },

    /**
     * 选择学段
     */
    handleSelectStage(ev) {
      var selectedStgId = ev.target.dataset.stgid;
      
      this.setData({
        selectedStgId: selectedStgId
      });

      this.getRelativeSubject(selectedStgId);
    },

    /**
     * 查询学科
     */
    getSubject() {
      API.Question.getSubject().then((rep) => {
        this.setData({
          subject: rep
        });
      });
    },

    /**
     * 获取关联学科
     */
    getRelativeSubject(stgId) {
      this.data.subject.forEach((item) => {
        if (item.stgId === stgId) {
          this.setData({
            relativeSubject: item.subjects
          });
        }
      });
    },

    /**
     * 选择学科
     */
    handleSelectSubject(ev) {
      var selectedSbjId = ev.target.dataset.sbjid;

      this.setData({
        selectedSbjId: selectedSbjId
      });
    },

    /**
     * 显示教材版本选择组件
     */
    handleVisibleVersion() {
      this.setData({
        visibleVersion: true
      });
    },

    /**
     * 显示教材章节选择组件
     */
    handleVisibleChapter() {
      this.setData({
        visibleChapter: true
      });
    },

    /**
     * 选择教材版本和课本
     */
    handleSelectBook(data) {
      this.setData({
        tempEdtName: data.detail.edtName,
        tempTbkName: data.detail.tbkName,
        tempTbkId: data.detail.tbkId
      });
    },

    /**
     * 获取章节树
     */
    getChapterTree(tbkId) {
      API.Question.getChapterTree(tbkId).then((rep) => {
        this.setData({
          treeData: rep
        });
      });
    },

    /**
     * 选中教材章节节点
     */
    handleSelectChapter(data) {
      this.setData({
        tempNodeName: data.detail.name,
        tempNodeId: data.detail.id
      });
    },

    /**
     * 取消
     */
    handleClose() {
      // 教材版本选择组件、教材章节选择打开状态下
      if (this.data.visibleVersion || this.data.visibleChapter) {
        this.closeLayer();
        return;
      }

      // 整个选择组件
      this.triggerEvent('close');
    },

    /**
     * 确定
     */
    handleConfirm() {
      // 教材版本选择组件
      if (this.data.visibleVersion) {
        this.setData({
          selectedEdtName: this.data.tempEdtName,
          selectedTbkName: this.data.tempTbkName,
          selectedTbkId: this.data.tempTbkId
        });
        this.getChapterTree(this.data.selectedTbkId);
        this.closeLayer();
        return;
      }

      // 教材章节选择打开状态下
      if (this.data.visibleChapter) {
        this.setData({
          selectedNodeName: this.data.tempNodeName,
          selectedNodeId: this.data.tempNodeId
        });
        this.closeLayer();
        return;
      }

      // 整个选择组件
      this.triggerEvent('confirm', { index: 11 });
    },

    /**
     * 关闭教材版本、教材章节选择组件
     */
    closeLayer() {
      this.setData({
        visibleVersion: false
      });

      this.setData({
        visibleChapter: false
      });
    }
  }
})
