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
    recorderManager:null,
    questionData: {
      fileId:null,
      thumbnail:null,
      audio:null,
      imgs: [],
      type: 1,
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      workId: options.workId
    })
    this.getWorkById();
  },
  getWorkById() {
    let that = this
    Api.Preview.getWorkById(this.data.workId).then((res) => {
      let $data = JSON.parse(res.data)
      that.setData({
        questionData: res.work
      })
    })
  },
  // 暂存数据
  pushWorkStorage() {
    Api.Preview.pushWorkStorage(this.data.workId, this.data.questionData).then(res => {
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
        url: 'http://122.112.239.223:8080/file/upload/image/binary',
        name: 'file',
        formData: {
          'user': 'test'
        },
        success(res1) {
          let $obj = that.data.questionData
          $obj.imgs.push(JSON.parse(res1.data).url);
          that.setData({
            questionData: {
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
      record: true,
    })
  },
  // 结束录像回调
  handleStopRecord(res) {
    let that = this
    const tempFilePaths = res.detail
    wx.uploadFile({
      url: 'http://122.112.239.223:8080/file/upload/plain/binary',
      filePath: tempFilePaths.tempVideoPath,
      name: 'file',
      success(res) {
        console.log(res)
        that.data.questionData.fileId = JSON.parse(res.data).url
        that.setData({
          questionData: that.data.questionData,
          record:false
        })
      }
    })
    wx.uploadFile({
      url: 'http://122.112.239.223:8080/file/upload/image/binary', 
      filePath: tempFilePaths.tempThumbPath,
      name: 'file',
      success(res) {
        that.data.questionData.thumbnail = JSON.parse(res.data).url || 'https://raw.githubusercontent.com/Tracy-xu/myk/master/assets/images/default.png'
        that.setData({
          questionData: that.data.questionData
        })
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
    let that = this
    that.setData({
      recordIng: !that.data.recordIng
    })
    if (!that.data.recorderManager){
      let RecorderManager = wx.getRecorderManager({
        format:'mp3'
        });
      that.setData({
        recorderManager: RecorderManager
      })
    }
    if (that.data.recordIng) {
      that.data.recorderManager.start({
        success: (res) => {
          wx.showToast({
            title: '开始录音',
          })
        }
      });
    } else {
      that.data.recorderManager.stop();
      that.data.recorderManager.onStop((res) =>{
        wx.showToast({
          title: '录音结束',
        })
        wx.uploadFile({
          url: 'http://122.112.239.223:8080/file/upload/plain/binary',
          name: 'file',
          success(res) {
            that.data.questionData.audio = JSON.parse(res.data).url;
            that.setData({
              questionData: that.data.questionData
            })
          }
        })
      })
    }
  },
  // 删除语音答案
  deleteVoice() {
    this.setData({
      questionData: {
        work: {
          fileId: null,
        }
      }
    })
  },
})