import router from '../../../router/index.js';
import API from '../../../api/index.js';

Page({
  data: {
    detail: null,
    classData: []
  },

  onLoad: function (options) {
    var resId = options.resId;
    var refId = options.refId;
    this.getQuestionDetail(resId, refId);
    this.getBindClass(resId);
  },

  /**
   * 查询习题详情
   */
  getQuestionDetail(resId, refId) {
    API.Question.getQuestionDetail(resId, refId).then((res) => {
      this.setData({
        detail: res
      });
    });
  },

  /**
   * 查询绑定班级
   */
  getBindClass(resId) {
    API.Question.getBindClass(resId).then((rep) => {
      this.setData({
        classData: rep
      });
    });
  },

  /**
   * 解除绑定
   */
  async handleUnbindClass(ev) {
    await API.Question.unbindClass({
      klassPreconQueId: ev.target.dataset.id
    });

    var index = ev.target.dataset.index;

    this.data.classData.splice(index, 1);
    this.setData({
      classData: this.data.classData
    });
  },

  /**
   * 打开报告
   */
  openKlassPrequeView(ev){
    wx.navigateTo({
      url: `${router.analysisList}?klassPreconQueId=${ev.target.dataset.id}`
    });
  }
})