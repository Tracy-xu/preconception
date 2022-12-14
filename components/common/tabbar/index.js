// components/common/tabbar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    current: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * tab 切换
     */
    handleTabChange: function tabChange(e) {
      const index = + e.currentTarget.dataset.index;

      if (index === this.data.current) {
        return;
      }
      this.setData({
        current: index
      });

      this.triggerEvent('change', { index: index });
    }
  }
})
