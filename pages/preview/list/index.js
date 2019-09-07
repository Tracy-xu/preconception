// pages/preview-list/index.js
import router from '../../../router/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    subJectList:[
      "全部",
      "语文"  
    ]
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