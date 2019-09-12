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
    tempEdtId: null,
    tempTbkName: '',
    tempTbkId: null,
    selectedEdtName: '',
    selectedEdtId: null,
    selectedTbkName: '',
    selectedTbkId: null,

    // 章节
    tempNodeName: '',
    tempNodeId: null,
    tempNodePid: null,
    selectedNodeName: '',
    selectedNodeId: null,
    selectedNodePid: null,
    path: [],
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
        tempEdtId: data.detail.edtId,
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
        tempNodeId: data.detail.id,
        tempNodePid: data.detail.pid
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
          selectedEdtId: this.data.tempEdtId,
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
          selectedNodeId: this.data.tempNodeId,
          selectedNodePid: this.data.tempNodePid
        });

        // 查找父节点
        var path = [];
        var treeData = [this.data.treeData];
        var pid = this.data.selectedNodePid;
        var id = this.data.selectedNodeId;
        var name = this.data.selectedNodeName;

        this.findAllParent({ pid, id, name }, treeData, path);
        path.unshift({ name, id, pid });
        this.setData({
          path: path
        });

        this.closeLayer();
        return;
      }

      // 整个选择组件
      var stgId = this.data.selectedStgId;
      var sbjId = this.data.selectedSbjId;
      var edtId = this.data.selectedEdtId;
      var tbkId = this.data.selectedTbkId;

      // 需要校验数据
      this.triggerEvent('confirm', {
        stgId, 
        sbjId, 
        edtId, 
        tbkId, 
        tbkNodeId: this.data.selectedNodeId, 
        name: this.data.selectedNodeName, 
        path: this.data.path
      });
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
    },

    /**
     * 查找父节点
     */
    findAllParent(node, tree, parentNodes = [], index = 0) {
      if (!node || node.pid === 0) {
        return
      }

      this.findParent(node, parentNodes, tree);
      let parentNode = parentNodes[index];
      this.findAllParent(parentNode, tree, parentNodes, ++index);

      return parentNodes;
    },

    findParent(node, parentNodes, tree) {
      for (let i = 0; i < tree.length; i++) {
        let item = tree[i]
        if (item.data.id === node.pid) {
          parentNodes.push({
            id: item.data.id,
            pid: item.data.pid,
            name: item.data.name
          });

          return;
        }
        if (item.children && item.children.length > 0) {
          this.findParent(node, parentNodes, item.children);
        }
      }
    }
  }
})
