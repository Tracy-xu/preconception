import API from '../../../api/index.js';

Page({
  data: {
    detail: null
  },

  onLoad: function (options) {
    var resId = options.resId;
    var refId = options.refId;
    this.getQuestionDetail(resId, refId);
  },

  getQuestionDetail(resId, refId) {
    API.Question.getQuestionDetail(resId, refId).then((res) => {
      this.setData({
        detail: res
      });
    });
  }
})