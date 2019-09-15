import API from '../../../api/index.js';

const app = getApp();

Page({
  data: {
    userInfo: null,
    resId: null,
    refId: null,
    klassIds: [],
    historyKlassIds: []
  },

  onLoad: function (options) {
    this.setData({
      resId: options.resId,
      refId: options.refId
    });
  },

  onReady() {
    this.setData({
      userInfo: app.globalData.userInfo
    });

    this.getBindClass();
  },

  /**
   * 查询绑定历史
   */
  getBindClass() {
    API.Question.getBindClass(this.data.resId).then((rep) => {
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
    var refId = this.data.refId;
    var resId = this.data.resId

    API.Question.bindClass({ klassIds, refId, resId }).then(() => {
      wx.navigateBack();
    });
  }
})
