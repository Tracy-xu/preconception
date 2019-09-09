// pages/preview/detail/index.js
import preview from "../../../api/index.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    workId:null,
    questionData:{}
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      workId: options.workId
    })
    this.getWorkById();
  },
  getWorkById() {
    preview.Preview.getWorkById(this.data.workId).then((res) => {
      this.setData({
        questionData: res.work
      })
    })
  },
  putAnswerLike() {
    preview.Preview.putAnswerLike().then(res => {
      wx.navigateBack();
    })
  }
})