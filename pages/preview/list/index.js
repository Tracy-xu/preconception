// pages/preview-list/index.js
import router from '../../../router/index'
import Api from '../../../api/index'
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
    this.getAllSubject();
    this.getStudentById();
    this.getWorkList();
  },
  getWorkList(){
    if (this.workList.length >= this.data.total){
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
      if (this.data.curPage === 1) {
        this.setData({
          workList: []
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
    })
  },
  getAllSubject() {
    Api.Preview.getAllSubject().then(res => {
      this.data.subJectList = [];
      this.data.subJectList.push('全部')
      res.forEach((item) => {
        this.data.subJectList.push(item.sbjName)
      })
      this.setData({
        subJectList: this.data.subJectList,
        subJectListObj: res,
      })
      console.log(res)
    })
  },
  getStudentById(){
    Api.Preview.getStudentById(this.data.studentId).then(res => {
      let $arr = [];
      res.klass.subjectTeacherMap.subjects.forEach((item) => {
        $arr.push(itrm.name)
      })
      this.setData({
        userInfo: res,
        klassName: res.klass.name,
        klassId: res.klass.id,
        subJectList: $arr
      })
    })
  },
  // 学生查看详情
  goToDetail(data){
    wx.navigateTo({
      url: `${router.questionEdit}?workId=${data.work.workId}&klassPreconQueId=${data.work.klassPreconQueId}&mode=${item.content.mode}`,
    })
  },
  // 学生去预习
  goDoWork(data) {
    wx.navigateTo({
      url: `${router.exercises}?workId=${data.work.workId}`,
    })
  },
  // 根据学科筛选题目
  showActionSheet(res){
   this.setData({
     actionSheetHidden: false,
   })
  },
  bindActionItem(event) {
    this.setData({
      actionSheetHidden: true,
      subjId: event.currentTarget.dataset.subjid
    })
    this.getWorkList()
  }
})