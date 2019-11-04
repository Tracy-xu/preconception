// pages/profile/index.js
import router from '../../router/index.js';
import API from '../../api/index.js';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    from:0,
    showDialog:false,
    buttons: [{ text: '取消' }, { text: '确定' }],
    roleId: 1, //1 老师,2 学生
    img:'',
    userName:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      from:options.from,
      userName: app.globalData.userInfo.name,
      img:app.globalData.userInfo.photo,
    })
  },
  handleTabChange(data){
    const index = data.detail.index;
    if (index === 0 && this.data.from) {
      wx.redirectTo({
        url: `${router.previewList}`
      });
    } else if (index === 0){
      wx.redirectTo({
        url: router.arrangementRecord// router.questionList
      });
    }
  },
  /**
     * 跳转我的班级页面
     */
  goToMyClass: function () {
    wx.navigateTo({
      url: router.myClass
    });
  },
  /**
     * 跳转我创编的问题页面
     */
  goToRecord: function () {
    wx.navigateTo({
      url: router.myQuestions
    });
  },
  // 解除账号绑定
  deleteUser(){
    this.setData({
      showDialog:true,
    })
  },
  // 解除账号确认
  tapDialogButton(e) {
   console.log(e.detail)
   if(e.detail.index==0){
     this.setData({
       showDialog: false,
     })
   }else{
     API.Auth.unBind().then(v=>{
       wx.redirectTo({
         url: router.auth
       });
     });
   }
  },
})