// pages/profile/index.js
import router from '../../router/index.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roleId: 1, //1 老师,2 学生
    img:'http://g.hiphotos.baidu.com/image/pic/item/c2cec3fdfc03924590b2a9b58d94a4c27d1e2500.jpg'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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
})