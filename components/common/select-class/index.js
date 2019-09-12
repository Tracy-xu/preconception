import API from '../../../api/index.js';

const app = getApp();

Component({
  properties: {
    resId: {
      type: Number
    },
    refId: {
      type: Number
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
      var refId = this.properties.refId;
      var resId = this.properties.resId

      API.Question.bindClass({ klassIds, refId, resId }).then(() => {
        this.triggerEvent('confirmbindclass');
      });
    },
  }
})
