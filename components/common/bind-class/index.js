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
    klassIds: [],
    historyKlassIds: []
  },

  ready() {
    this.setData({
      userInfo: app.globalData.userInfo
    });

    if (this.properties.resourceIds.length) {
      this.getBindClass();
    }
  },

  methods: {
    /**
     * 查询绑定历史
     */
    getBindClass() {
      var resId = this.properties.resourceIds[0].resId;
      API.Question.getBindClass(resId).then((rep) => {
        var historyKlassIds = [];
        rep.forEach((item) => {
          historyKlassIds.push(item.klassId);
        });

        this.setData({
          historyKlassIds,
          klassIds: [...(new Set(historyKlassIds))]
        });
      });
    },

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
