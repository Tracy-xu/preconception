// pages/preview/detail/index.js
import Api from "../../../api/index.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    curPage:1,
    activeWorkId:null,
    activeWorkDetail:{
      mode:1,
    },
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
      subjId: options.subjId,
      klassPreconQueId: options.klassPreconQueId,
      mode: options.mode
    })
    this.getWorkListByklassPreconQueId();
  },
  getWorkListByklassPreconQueId() {
    Api.Preview.getWorkList(this.data.klassPreconQueId).then(res => {
        this.setData({
          workList: res.data
        })
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

  },
  putAnswerLike() {
    Api.Preview.c(workId,activeWorkId).then(res => {
      wx.navigateBack();
    })
  }
})