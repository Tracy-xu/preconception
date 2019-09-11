Component({
  properties: {
    treeData: {
      type: Object,
      value: null
    },
    selectId: {
      type: Number,
      value: 0
    }
  },

  data: {
    open: true,
    hasChildren: false,
  },

  ready() {
    this.setData({
      hasChildren: !!(this.data.treeData.children && this.data.treeData.children.length)
    });
  },

  attached() {
    this.openDefaultNode();
  },

  methods: {
    /**
     * 节点展开收起
     */
    handleToggle: function (e) {
      if (this.data.hasChildren) {
        this.setData({
          open: !this.data.open,
        });
      }
    },

    /**
     * 选中节点
     */
    handleClickTreeNode: function (e) {
      var id = e.currentTarget.dataset.id;
      var name = e.currentTarget.dataset.name;

      this.triggerEvent('selectchapter', { id, name }, { bubbles: true, composed: true });
    },

    /**
     * 展开默认节点
     */
    openDefaultNode() {
      if (this.data.treeData.data.id == this.data.id) {
        this.setData({
          open: true
        });

        let parent = this.$parent;
        while (parent) {
          parent.open = true;
          parent = parent.$parent;
        }
      }
    }
  }
})
