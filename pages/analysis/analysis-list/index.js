// pages/analysis/analysis-list/index.js
import router from '../../../router/index.js';
import API from '../../../api/analysis/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    width: 50,
    klassPreconQueId: null,
    quanwen: false,
    lkRatio: null,
    ulkRatio: null,
    mode: null,
    createdOnStr: null,
    workReport: {
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      klassPreconQueId: options.klassPreconQueId || 18
    });
    API.Analysis.analyze(this.data.klassPreconQueId).then(res => {
      let wr = res;
      let mode = res.item.content.mode;
      let lkRatio = Math.floor(wr.like / wr.size * 100);
      let unlkRatio = Math.floor(wr.unlike / wr.size * 100);
      this.setData({
        mode: wr.klassPreconQue.mode,
        createdOnStr: wr.klassPreconQue.createdOnStr,
        fnsRatio: Math.floor(wr.commit / wr.size * 100),
        lkRatio: lkRatio,
        ulkRatio: unlkRatio,
        workReport: wr
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
    if (!this.data.workReport.commit){
      wx.showToast({
        title: '当前还没有学生提交，暂时不能查看报告详情',
        icon: 'none',
        duration: 2000
      })
      return;
    }
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