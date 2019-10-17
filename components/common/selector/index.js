import API from '../../../api/index.js';

Component({
  properties: {
    stgId: {
      type: Number
    },
    sbjId: {
      type: Number
    },
    edtId: {
      type: Number
    },
    tbkId: {
      type: Number
    },
    tbkNodeId: {
      type: Number
    },
    edtName: {
      type: String
    },
    tbkName: {
      type: String
    },
    nodeName: {
      type: String
    },
    path: {
      type: Array
    }
  },

  data: {
    visibleEdition: false,
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

  async ready() {
    await this.getStage();
    await this.getSubject();

    // 如果有默认数据，需初始化默认数据
    this.setData({
      selectedStgId: this.properties.stgId,
      selectedSbjId: this.properties.sbjId,
      selectedEdtId: this.properties.edtId,
      selectedTbkId: this.properties.tbkId,
      selectedNodeName: this.properties.nodeName,
      selectedEdtName: this.properties.edtName,
      selectedTbkName: this.properties.tbkName,
      tempNodeId: this.properties.tbkNodeId,
      path: this.properties.path
    });
 
    if (this.data.selectedStgId) {
      this.getRelativeSubject(this.data.selectedStgId);
    }

    if (this.data.selectedTbkId) {
      this.getChapterTree(this.data.selectedTbkId);
    }
  },

  methods: {
    /**
     * 查询学段
     */
    getStage() {
      return API.Question.getStage().then((rep) => {
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
        selectedStgId: selectedStgId,

        // 清空其他
        selectedSbjId: null,
        selectedEdtId: null,
        selectedTbkId: null,
        selectedEdtName: '',
        selectedTbkName: '',
        selectedNodeName: '',
        tempNodeId: null,
        path: []
      });

      this.getRelativeSubject(selectedStgId);
    },

    /**
     * 查询学科
     */
    getSubject() {
      return API.Question.getSubject().then((rep) => {
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
        selectedSbjId: selectedSbjId,

        // 清空其他
        selectedEdtId: null,
        selectedTbkId: null,
        selectedEdtName: '',
        selectedTbkName: '',
        selectedNodeName: '',
        tempNodeId: null,
        path: []
      });
    },

    /**
     * 显示教材版本选择组件
     */
    handleVisibleEdition() {
      if (!this.data.selectedStgId || !this.data.selectedSbjId) {
        wx.showToast({
          title: '请先选择学段学科',
          icon: 'none',
          duration: 2000
        });
        return;
      }

      this.setData({
        visibleEdition: true
      });
    },

    /**
     * 显示教材章节选择组件
     */
    handleVisibleChapter() {
      if (!this.data.treeData) {
        wx.showToast({
          title: '请先选择教材版本',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      
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
        tempTbkId: data.detail.tbkId,

        // 清空其他
        selectedTbkName: '',
        selectedNodeName: '',
        tempNodeId: null,
        path: []
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
      if (this.data.visibleEdition || this.data.visibleChapter) {
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
      if (this.data.visibleEdition) {
        if ((this.data.tempTbkId === null) && (this.data.selectedTbkId === null)) {
          wx.showToast({
            title: '请选择课本',
            icon: 'none',
            duration: 2000
          });
          return;
        }

        // 如果没有手动选择，则采用默认值
        this.setData({
          selectedEdtName: this.data.tempEdtName || this.data.selectedEdtName,
          selectedEdtId: this.data.tempEdtId || this.data.selectedEdtId,
          selectedTbkName: this.data.tempTbkName || this.data.selectedTbkName,
          selectedTbkId: this.data.tempTbkId || this.data.selectedTbkId
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
      var tbkNodeId = this.data.selectedNodeId;
      var nodeName = this.data.selectedNodeName;
      var edtName = this.data.selectedEdtName;
      var tbkName = this.data.selectedTbkName;
      var path = this.data.path;

      // 需要校验数据
      if (!stgId || !sbjId) {
        wx.showToast({
          title: '请先选择学段学科',
          icon: 'none',
          duration: 2000
        });
        
        return;
      }

      // 设置数据偏好
      API.Question.setTbkPreference({
        stgId,
        sbjId,
        edtId,
        tbkId,
        tbkNode: [{
          attrs: {
            edtId,
            tbkId,
            edtName,
            tbkName
          },
          path: path.reverse()
        }]
      });

      this.triggerEvent('confirm', {
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

    /**
     * 关闭教材版本、教材章节选择组件
     */
    closeLayer() {
      this.setData({
        visibleEdition: false
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
