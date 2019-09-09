// pages/analysis/analysis-list/index.js
import router from '../../../router/index.js';
import API from '../../../api/analysis/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    view: 'video',
    width: 50,
    klassPreconQueId: null,
    quanwen: false,
    lkRatio: Math.floor(3 / 10 * 100),
    ulkRatio: 100 - Math.floor(3 / 10 * 100),
    workReport: {
      size: 12,
      commit: 5,
      like: 3,
      unlike: 2,
      item: { content: '问题问题问题问题问题问题问题问题问题问题问题问题问题问题问题'}
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      klassPreconQueId: options.klassPreconQueId || 1
    });
    API.Analysis.analyze(options.klassPreconQueId || 1).then(res => {
      let wr = res.data;
      let mode = res.data.item.content.mode;
      let lkRatio = Math.floor(w.like / wr.size * 100);
      this.setData({
        createdOnStr: wr.klassPreconQue.createdOn,
        fnsRatio: Math.floor(wr.commit / wr.size * 100),
        lkRatio: lkRatio,
        ulkRatio: 100 - lkRatio,
        workReport: wr,
        view: mode == 1 ? "text" : mode == 2 ? "img" : mode == 3 ? "video" : "voice"
      });
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  onGroupEdit: function(event) {
    wx.navigateTo({
      url: `${router.analysisDetail}?klassPreconQueId=${this.data.klassPreconQueId}`
    });
  },
  openQuanwen: function(event){
    this.setData({
      quanwen: !this.data.quanwen
    })
  }
})