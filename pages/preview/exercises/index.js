// pages/exercises/index.js
import chooseImage from '../../../utils/choose-image/choose-image.js';
import Api from "../../../api/index.js";
import router from "../../../router/index.js";
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    workId: null,
    files: [],
    dialogShow: false,
    record: false,
    recordIng: false,
    playVideoFlag: false,
    showAllFlag: false,
    recorderManager: null,
    questionData: {
      work: {
        answer: '',
        fileId: null,
        thumbnail: null,
        audio: null,
        imgs: [],
      },
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
      that.setData({
        questionData: res
      })
    })
  },
  // 暂存数据
  pushWorkStorage() {
    wx.showLoading({
      title: '暂存答案中哟~',
    });
    Api.Preview.pushWorkStorage(this.data.workId, this.data.questionData.work).then(res => {
      // 返回主页
      wx.hideLoading();
      wx.navigateBack();
    })
  },
  // 提交数据
  pushWorkSave() {
    wx.showLoading({
      title: '答提交中哟~',
    });
    Api.Preview.pushWorkSave(this.data.workId, this.data.questionData.work).then(res => {
      wx.hideLoading();
      // 进入相似答案
      this.goToDetail();
    })
  },
  // 查看相似观点
  goToDetail() {
    wx.redirectTo({
      url: `${router.previewDetail}?workId=${this.data.questionData.work.workId}&klassPreconQueId=${this.data.questionData.work.klassPreconQueId}&sbjId=${this.data.questionData.work.sbjId}&mode=${this.data.questionData.item.content.mode}`,
    })
  },
  // 上传图片
  uploadImg() {
    let that = this
    chooseImage().then(res => {
      const tempFilePaths = res
      wx.uploadFile({
        url: 'http://122.112.239.223:8080/file/upload/image/binary',
        filePath: tempFilePaths[0],
        name: 'file',
        formData: {
          'user': 'test'
        },
        success(res1) {
          let $obj = that.data.questionData.work;
          $obj.imgs = $obj.imgs ? $obj.imgs : [];
          $obj.imgs.push(JSON.parse(res1.data).url);
          that.setData({
            questionData: that.data.questionData,
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
    that.setData({
      record: false,
    });
    wx.showLoading({
      title: '视频上传中~',
    });
    wx.uploadFile({
      url: 'http://122.112.239.223:8080/file/upload/plain/binary',
      filePath: tempFilePaths.tempVideoPath,
      name: 'file',
      success(res) {
        console.log(res)
        that.data.questionData.work.fileId = JSON.parse(res.data).url
        that.setData({
          questionData: that.data.questionData,
          record: false
        });
        wx.hideLoading();
      }
    })
    wx.uploadFile({
      url: 'http://122.112.239.223:8080/file/upload/image/binary',
      filePath: tempFilePaths.tempThumbPath,
      name: 'file',
      success(res) {
        that.data.questionData.work.thumbnail = JSON.parse(res.data).url || 'http://122.112.239.223:13000/xuwenbo/preconception/raw/master/assets/images/default.png'
        that.setData({
          questionData: that.data.questionData
        })
      }
    })
  },
  // 播放视频
  playvideo() {
    console.log("ddd")
    this.setData({
      playVideoFlag: true,
    })
  },
  // 暂停播放视频
  handleCloseVideo() {
    this.setData({
      playVideoFlag: false,
    })
  },
  // 上传语音
  uploadVoice() {
    let that = this
    that.setData({
      recordIng: !that.data.recordIng
    })
    if (!app.globalData.RecorderManager) {
      app.globalData.RecorderManager = wx.getRecorderManager({
        format: 'mp3'
      });
    }
    if (that.data.recordIng) {
      app.globalData.RecorderManager.start({
        success: (res) => {
          wx.showToast({
            title: '开始录音',
          })
        }
      });
    } else {
      app.globalData.RecorderManager.stop();
      app.globalData.RecorderManager.onStop((res) => {
        wx.showToast({
          title: '录音结束',
        })
        wx.showLoading({
          title: '录音上传中',
        });
        wx.uploadFile({
          url: 'http://122.112.239.223:8080/file/upload/plain/binary',
          name: 'file',
          filePath: res.tempFilePath,
          success(res1) {
            that.data.questionData.work.audio = JSON.parse(res1.data).url;
            that.setData({
              questionData: that.data.questionData
            });
            that.uploadAsr();
            wx.hideLoading();
          }
        })
      });
    }
  },
  // 删除语音答案
  deleteVoice() {
    this.data.questionData.work.audio = '';
    this.setData({
      questionData: this.data.questionData,
    })
  },
  // 删除视频
  deleteVideo() {
    this.data.questionData.work.fileId = '';
    this.data.questionData.work.thumbnail = '';
    this.setData({
      questionData: this.data.questionData,
    })
  },
  // 输入文字
  answerHander(event) {
    this.data.questionData.work.answer = event.detail.value;
    this.setData({
      questionData: this.data.questionData
    })
  },
  // 转换文字
  uploadAsr() {
    Api.Preview.asr(this.data.questionData.work.audio).then(res => {
      if (res.id) {
        this.data.questionData.work.answer = null;
        this.setData({
          questionData: this.data.questionData,
          id: res.id
        })
      }
    });
  },
  asr() {
    let that = this;
    wx.showLoading({
      title: '语音转换中',
    });
    Api.Preview.getAsrDetail(that.data.id).then(resDetail => {
      if (resDetail.status === 1) {
        that.data.questionData.work.answer = resDetail.details[0].result.result.join(',');
        that.setData({
          questionData: that.data.questionData,
        })
      } else {
        wx: wx.showToast({
          title: resDetail.msg,
        })
      }
      wx.hideLoading();
    })

  },
  // 编辑语音转换文字
  editAnswer() {
    this.setData({
      dialogShow:true,
    })
  },
  bindFormSubmit(e) {
    this.data.questionData.work.answer = e.detail.value.textarea
    this.setData({
      questionData: this.data.questionData,
      dialogShow: false,
    })
  },
  // 全文
  showAll(){
    this.setData({
      showAllFlag: !this.data.showAllFlag,
    })
  },
  showBigImage(event){
    let $src= event.currentTarget.dataset.src;
    wx.previewImage({
      urls: this.data.questionData.item.content.imgs,
      current: $src
    })
  }
})