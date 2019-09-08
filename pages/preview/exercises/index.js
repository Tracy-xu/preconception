// pages/exercises/index.js
import chooseImage from '../../../utils/choose-image/choose-image.js';
import { preview } from "../../../api/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    workId: null,
    files: null,
    questionData:{
      type:1,
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      workId:options.workId
    })
    this.getWorkById();
  },
  getWorkById(){
    preview.Preview.getWorkById(this.data.workId).then((res) => {
      this.setData({
        questionData:res.work
      })
    })
  },
  // 暂存数据
  pushWorkStorage(){
    preview.Preview.pushWorkStorage(this.data.workId,this.data.questionData).then(res => {
      // 返回主页
      wx.navigateBack()
    })
  },
  // 提交数据
  pushWorkSave() {
    preview.Preview.pushWorkSave(this.data.workId, this.data.questionData).then(res => {
      // 返回主页
      wx.navigateBack()
    })
  },
  // 上传图片
  uploadImg() {
    chooseImage().then(res => {
      const tempFilePaths = res.tempFilePaths
      that.setData({
        files: that.data.files.concat(res.tempFilePaths)
      });
      wx.uploadFile({
        url: 'https://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
        filePath: tempFilePaths[0],
        name: 'file',
        formData: {
          'user': 'test'
        },
        success(res) {
          this.getWorkById()
          const data = res.data
          //do something
        }
      })
    })
  },
  // 上传视频
  uploadVideo() {
    
  }
})