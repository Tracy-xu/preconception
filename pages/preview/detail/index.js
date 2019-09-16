// pages/preview/detail/index.js
import Api from "../../../api/index.js"
import LocalDate from "../../../utils/local-date/index.js"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visible: false,
    overSle: false,
    curPage: 1,
    activeWorkId: null,
    activeWorkDetail: {},
    videoSrc: '',
    total: 0,
    doneNum: 0,
    subjId: null,
    workId: null,
    workList: [],
    dialogShow: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      workId: options.workId,
      sbjId: options.sbjId,
      klassPreconQueId: options.klassPreconQueId,
      mode: parseInt(options.mode)
    })
    this.getWorkListByklassPreconQueId();
  },
  // 监听页面卸载
  onUnload(){
    let $page = getCurrentPages();
    $page[0].getWorkList();
  },
  getWorkListByklassPreconQueId() {
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function() {
      wx.hideLoading()
    }, 2000)
    Api.Preview.getWorkListByklassPreconQueId(this.data.klassPreconQueId).then(res => {
      this.data.total = res ? res.length : 0;
      this.data.doneNum = 0;
      res.forEach((item) => {
        item.startTime = LocalDate.format(item.startTime, 'yyyy-MM-dd');
        if(item.status === 2){
          this.data.doneNum++;
        }
        if(item.preWkId){
          this.setData({
            activeWorkId: item.preWkId,
            overSle: true,
          })
        }
      })
      res = res.filter(item => {
        return item.userId !== app.globalData.userInfo.id && item.status === 2
      })
      this.setData({
        total: this.data.total,
        doneNum: this.data.doneNum,
        workList: res
      })
      wx.hideLoading();
    })
  },
  showMyAnswer() {
    Api.Preview.getWorkById(this.data.workId).then(res => {
      this.setData({
        activeWorkDetail: res,
        dialogShow: true,
      })
    })
  },
  selWork(event) {
    if (!this.data.overSle){
      this.setData({
        activeWorkId: event.currentTarget.dataset.id
      })
    }
  },
  showImg(){
    wx.previewImage({
      urls: this.data.activeWorkDetail.work.imgs,
    })
  },
  playVideo() {
    this.setData({
      videoSrc: this.data.activeWorkDetail.work.fileId,
      visible: true
    })
  },
  handleCloseVideo() {
    this.setData({
      visible: false
    })
  },
  // 暂无相似观点
  putNoAnswerLike() {
    Api.Preview.putAnswerLike(this.data.workId, 0).then(res => {
      wx.navigateBack({
        success: function() {
          wx.redirectTo({
            url: router.previewList,
          })
        }
      });
    })
  },
  // 提交观点
  putAnswerLike() {
    Api.Preview.putAnswerLike(this.data.workId, this.data.activeWorkId).then(res => {
      wx.navigateBack({
        success: function() {
          wx.redirectTo({
            url: router.previewList,
          })
        }
      });
    })
  }
})