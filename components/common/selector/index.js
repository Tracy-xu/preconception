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
    treeData: {
      id: 12, 
      name: 'My Tree',
      children: [
        {
          id: 1,
          name: 'hello'
        },
        {
          id: 2,
          name: 'wat'
        },
        {
          id: 3,
          name: 'child folder',
          children: [
            {
              id: 4,
              name: 'child folder',
              children: [
                {
                  id: 5,
                  name: 'hello'
                },
                {
                  id: 6,
                  name: 'wat'
                }
              ]
            },
            {
              id: 7,
              name: 'hello'
            },
            {
              id: 8,
              name: 'wat'
            },
            {
              id: 9,
              name: 'child folder',
              children: [
                {
                  id: 10,
                  name: 'hello'
                },
                {
                  id: 11,
                  name: 'wat'
                }
              ]
            }
          ]
        }
      ]
    },
    selectId: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
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
      // 教材版本选择组件、教材章节选择打开状态下
      if (this.data.visibleVersion || this.data.visibleChapter) {
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
    },

    /**
     * 选中教材章节节点
     */
    handleSelectChapter(data) {
      this.setData({
        selectId: data.detail.selectId
      });
    }
  }
})
