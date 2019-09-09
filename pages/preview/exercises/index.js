// pages/exercises/index.js
import chooseImage from '../../../utils/choose-image/choose-image.js';
import Api from "../../../api/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    workId: null,
    files: [],
    record: false,
    recordIng: false,
    playVideoFlag: false,
    questionData: {
      imgs:[],
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
    let that = this
    Api.Preview.getWorkById(this.data.workId).then((res) => {
      let $data = JSON.parse(res.data)
      that.setData({
        "questionData": res.work
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
    let that = this
    chooseImage().then(res => {
      const tempFilePaths = res
      that.setData({
        files: that.data.files.concat(res.tempFilePaths)
      });
      wx.uploadFile({
        url: 'http://122.112.239.223:8080/file/upload/image/binary', //仅为示例，非真实的接口地址
        filePath: tempFilePaths[0],
        name: 'file',
        formData: {
          'user': 'test'
        },
        success(res1) {
          let $obj = that.data.questionData
          $obj.imgs.push(JSON.parse(res1.data).url);
          that.setData({
            questionData:{
              imgs: $obj.imgs
            }
          })
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
    let RecorderManager = wx.getRecorderManager();
    console.log(RecorderManager)
    return;
    if(this.data.recordIng){
      RecorderManager.start({
        success:() => {
          wx.showToast({
            title: '开始录音',
          })
        }
      })
    }else {
      RecorderManager.stop({
        success: (res) => {
          console.log(res)
          wx.showToast({
            title: '录音结束',
          })
          wx.uploadFile({
            url: 'http://122.112.239.223:8080/file/upload/audio/binary', //仅为示例，非真实的接口地址
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