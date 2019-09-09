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
    record: false,
    recordIng: false,
    playVideoFlag: false,
    questionData:{
      type:1,
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.setData({
      workId:options.workId
    })
    this.getWorkById();
  },
  getWorkById(){
    Api.Preview.getWorkById(this.data.workId).then((res) => {
      this.setData({
        questionData:res.work
      })
    })
  },
  // 暂存数据
  pushWorkStorage(){
    Api.Preview.pushWorkStorage(this.data.workId,this.data.questionData).then(res => {
      // 返回主页
      wx.navigateBack()
    })
  },
  // 提交数据
  pushWorkSave() {
    Api.Preview.pushWorkSave(this.data.workId, this.data.questionData).then(res => {
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
          this.setData
          //do something
        }
      })
    })
  },
  // 上传视频
  uploadVideo() {
    this.setData({
      record:true,
    })
  },
  // 结束录像回调
  handleStopRecord(res) {
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
      }
    })
  },
  // 播放视频
  playvideo(src) {
    this.setData({
      playVideoFlag: true
    })
  },
  // 上传语音
  uploadVoice() {
    this.setData({
      recordIng: !this.data.recordIng
    })
    if(this.data.recordIng){
      wx.startRecord({
        success:()=>{
          wx.showToast({
            title: '开始录音',
          })
        }
      })
    }else{
      wx.stopRecord({
        success: (res) => {
          wx.showToast({
            title: '录音结束',
          })
          wx.uploadFile({
            url: 'https://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
            filePath: res,
            name: 'file',
            formData: {
              'user': 'test'
            },
            success(res) {
              this.getWorkById()
              const data = res.data
            }
          })
        }
      })
    }
    wx.getRecorderManager().then(res => {
      console.log(res)
    })
  },
  // 删除语音答案
  deleteVoice(){
    this.setData({
      questionData:{
        work:{
          fileId:null,
        }
      }
    })
  },
})