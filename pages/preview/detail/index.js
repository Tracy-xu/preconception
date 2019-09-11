// pages/preview/detail/index.js
import Api from "../../../api/index.js"
import LocalDate from "../../../utils/local-date/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visible:false,
    curPage:1,
    activeWorkId:null,
    activeWorkDetail:{},
    videoSrc:'',
    total:0,
    doneNum:0,
    subjId:null,
    workId:null,
    workList:[],
    dialogShow:false,
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      workId: options.workId,
      sbjId: options.sbjId,
      klassPreconQueId: options.klassPreconQueId,
      mode: parseInt(options.mode)
    })
    this.getWorkListByklassPreconQueId();
  },
  getWorkListByklassPreconQueId() {
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
    console.log(LocalDate)
    Api.Preview.getWorkListByklassPreconQueId(this.data.klassPreconQueId).then(res => {
      res.forEach((item) => {
        item.startTime = LocalDate.format(item.startTime, 'yyyy-MM-dd')
      })
        this.setData({
          workList: res
        })
      wx.hideLoading();
      })
  },
  showMyAnswer() {
    Api.Preview.getWorkById(this.data.workId).then(res => {
      this.setData({
        activeWorkDetail:res.data,
        dialogShow:true,
      })
    })
  },
  selWork(data) {
    this.setData({
      activeWorkId:data.workId
    })
  },
  playVideo(data){
    this.setData({
      videoSrc: data.fileId,
      visible: true
    })
  },
  handleCloseVideo() {
    this.setData({
      visible:false
    })
  },
  putAnswerLike() {
    Api.Preview.c(workId,activeWorkId).then(res => {
      wx.navigateBack();
    })
  }
})