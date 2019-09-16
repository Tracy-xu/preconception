import API from '../../../api/index.js';

const app = getApp();

Component({
  properties: {
    resourceIds: {
      type: Array
    }
  },

  data: {
    userInfo: null,
    klassIds: []
  },

  ready() {
    this.setData({
      userInfo: app.globalData.userInfo
    });
  },

  methods: {
    /**
     * 勾选班级
     */
    handleCheckBoxChange(ev) {
      this.setData({
        klassIds: ev.detail.value
      });
    },

    /**
     * 确定
     */
    handleConfirm() {
      var klassIds = this.data.klassIds;
      var pairs = this.properties.resourceIds;

      API.Question.bindClassBulk({ klassIds, pairs }).then(() => {
        this.triggerEvent('confirmbindclass');
      });
    },

    /**
     * 取消
     */
    handleCancel() {
      this.triggerEvent('cancelbindclass');
    }
  }
})
