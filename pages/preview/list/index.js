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
    subjId:null,
    workList:[],
    pageSize:10,
    total:0,
    subJectList:[
      "全部",
      "语文"  
    ]
  },
  onLoad(){
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
      subjId: this.data.subjId,
      curPage: this.data.curPage,
      klassId: this.data.klassId,
    }
    preview.Preview.getWorkList($data).then(res => {
      this.setData({
        workList: res.items,
        pageSize: res.page.pageSize,
        total: res.page.total,
      })
    })
  },
  getStudentById(){
    preview.Preview.getStudentById(this.data.studentId).then(res => {
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
      url: `${router.questionEdit}?workId=${data.work.workId}`,
    })
  },
  // 学生去预习
  goDoWork(data) {
    wx.navigateTo({
      url: `${router.exercises}?workId=${data.work.workId}`,
    })
  },
  // 根据学科筛选题目
  searchQuestion(){
    wx.showActionSheet({
      itemList: this.data.subJectList,
      success(res) {
        this.data.userInfo.klass.subjectTeacherMap.subjects.forEach((item) => {
          if (this.data.subJectList[res.tapIndex] === item.name){
            this.setData({
              curPage:1,
              subjId:item.id
            })
          }
        })
        console.log(res.tapIndex)
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
})