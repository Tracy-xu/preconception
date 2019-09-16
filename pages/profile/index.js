// pages/profile/index.js
import router from '../../router/index.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    from:0,
    showDialog:false,
    buttons: [{ text: '取消' }, { text: '确定' }],
    roleId: 1, //1 老师,2 学生
    img:'http://g.hiphotos.baidu.com/image/pic/item/c2cec3fdfc03924590b2a9b58d94a4c27d1e2500.jpg'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      from:options.from,
    })
    wx.getUserInfo({
      success: function(res) {
        console.log(res)
        alert(res.avatarUrl)
        this.setData({
          img: res.avatarUrl,
        })
      }
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
        url: `${router.questionList}`
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
     * 跳转我的记录页面
     */
  goToRecord: function () {
    wx.navigateTo({
      url: router.record
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
  },
})