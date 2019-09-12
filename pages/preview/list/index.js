// pages/preview-list/index.js
import router from '../../../router/index'
import Api from '../../../api/index'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    studentId: null,
    curPage: 1,
    klassId: null,
    klassName: null,
    userInfo: null,
    subjId:null,
    workList:[],
    pageSize:10,
    total:0,
    actionSheetHidden:true,
    subJectListObj:[],
  },
  onLoad(){
    this.data.studentId = app.globalData.userInfo.id;
    this.getAllSubject();
    this.getWorkList();
    this.getStudentById();
  },
  getWorkList(){
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
    let $data = {
      subjId: this.data.subjId,
      curPage: this.data.curPage,
      userId: this.data.studentId,
    }
    Api.Preview.getWorkList($data).then(res => {
      if (this.data.curPage === 1) {
        this.setData({
          workList: res.items
        })
      } else {
        let $arr = this.data.workList;
        this.setData({
          workList: arr.contact(res.items)
        })
      }
      this.setData({
        pageSize: res.page.pageSize,
        total: res.page.total,
      })
      wx.hideLoading();
    })
  },
  getStudentById(){
    Api.Preview.getStudentById(this.data.studentId).then(res => {
      this.setData({
        userInfo:res,
      })
    })
  },
  getAllSubject() {
    Api.Preview.getAllSubject().then(res => {
      this.data.subJectListObj = [];
      res.unshift({
        sbjId: null,
        sbjName: "全部"
      })
      this.setData({
        subJectListObj: res,
      })
    })
  },
  // 学生查看详情
  goToDetail(event){
    wx.navigateTo({
      url: `${router.previewDetail}?workId=${event.currentTarget.dataset.item.work.workId}&klassPreconQueId=${event.currentTarget.dataset.item.work.klassPreconQueId}&sbjId=${event.currentTarget.dataset.item.work.sbjId}&mode=${event.currentTarget.dataset.item.item.content.mode}`,
    })
  },
  // 学生去预习
  goDoWork(event) {
    console.log(event)
    wx.navigateTo({
      url: `${router.exercises}?workId=${event.currentTarget.dataset.item.work.workId}`,
    })
  },
  // 根据学科筛选题目
  showActionSheet(res){
   this.setData({
     actionSheetHidden: false,
   })
  },
  hideActionSheet(res) {
    this.setData({
      actionSheetHidden: true,
    })
  },
  changeCurpage(){
    if (this.data.workList.length >= this.data.total) {
      wx.showToast({
        title: '暂无更多数据',
        icon: 'none'
      })
      return;
    }
    this.setData({
      curPage:this.data.curPage + 1
    })
    this.getWorkList()
  },
  bindActionItem(event) {
    this.setData({
      curPage: 1,
      actionSheetHidden: true,
      subjId: event.currentTarget.dataset.subjid
    })
    this.getWorkList()
  }
})