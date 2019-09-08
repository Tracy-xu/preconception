// pages/preview-list/index.js
import router from '../../../router/index'
import {preview} from '../../../api/index'
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
    workList:[],
    pageSize:10,
    total:0,
    subJectList:[
      "全部",
      "语文"  
    ]
  },
  onReady(){
    this.getStudentById();
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
      curPage: this.data.curPage,
      klassId: this.data.klassId,
    }
    preview.Preview.getWorkList($data).then(res => {
      this.setData({
        workList: res.data.items,
        pageSize: res.data.page.pageSize,
        total: res.data.page.total,
      })
    })
  },
  getStudentById(){
    preview.Preview.getStudentById(this.data.studentId).then(res => {
      this.setData({
        userInfo: res.data,
        klassName: res.data.klass.name,
        klassId: res.data.klass.id,
        subJectList: res.data.klass.subjectTeacherMap.subjects
      })
    })
  },
  goToDetail(){
    wx.navigateTo({
      url: router.questionEdit,
    })
  },
  // 学生去预习
  goDoWork() {
    wx.navigateTo({
      url: router.exercises,
    })
  },
  // 根据学科筛选题目
  searchQuestion(){
    wx.showActionSheet({
      itemList: this.data.subJectList,
      success(res) {
        console.log(res.tapIndex)
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
})