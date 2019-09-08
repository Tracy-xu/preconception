Component({
  onReady: function (res) {
    this.videoContext = wx.createVideoContext('myVideo')
  },

  properties: {
    src: {
      type: String,
      value: ''
    }
  },

  methods: {
    /**
     * 播放
     */
    play: function () {
      this.videoContext.play()
    },

    /**
     * 暂停
     */
    pause: function () {
      this.videoContext.pause()
    },
    
    /**
     * 视频错误
     */
    handleVideoErrorCallback: function (e) {
      console.log('视频错误信息:')
      console.log(e.detail.errMsg)
    },

    /**
     * 关闭视频
     */
    handleCloseVideo() {
      this.triggerEvent('close');
    }
  }
})
