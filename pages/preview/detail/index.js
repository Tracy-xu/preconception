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
    klassId:null,
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
      klassId: options.klassId,
      mode: options.mode
    })
    this.getWorkList();
  },
  getWorkList() {
    if (this.workList.length >= this.data.total) {
      wx.showToast({
        title: '暂无更多数据',
        icon: 'none'
      })
      return;
    }
    let $data = {
      subjId: this.data.subjId,
      curPage: this.data.curPage,
      klassId: this.data.klassId,
      userId: this.data.studentId,
    }
    Api.Preview.getWorkList($data).then(res => {
      if (this.data.curPage === 1){
        this.setData({
          workList:[]
        })
      }else{
        let $arr = this.data.workList;
        this.setData({
          workList: arr.contact(res.items)
        })
      }
      let doneNum = 0;
      this.data.workList.forEach(item => {
        if(item.status === 2){
          doneNum++;
        }
      })
      this.setData({
        pageSize: res.page.pageSize,
        total: res.page.total,
        doneNum: doneNum
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