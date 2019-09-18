Component({
  attached() {
    console.log("dddd")
    this.ctx = wx.createCameraContext();
  },

  detached() {
    this.ctx = null;
  },
  data: {
    recording: false,
  },
  methods: {
    /**
     * 开始录像
     */
    handleStartRecord() {
      let that = this;
      console.log(this.ctx)
      this.ctx.startRecord({
        fail: () => {
          console.log("fff")
        },
        success: (res) => {
          console.log(res)
          that.setData({
            recording: true
          })
          console.log('startRecord');
        }
      })
    },

    /**
     * 停止录像
     */
    handleStopRecord() {
      let that = this;
      this.ctx.stopRecord({
        success: (res) => {
          that.setData({
            recording: false
          })
          that.triggerEvent('stoprecord', res);
        }
      });
    },
    /**
     * 取消录像
     */
    cancelRecord() {
      let that = this
      this.ctx.stopRecord({
        success: (res) => {
          that.setData({
            recording: false
          })
          that.triggerEvent('cancelrecord', res);
        }
      })
    }
  }
})