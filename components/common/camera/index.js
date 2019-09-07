Component({
  attached() {
    this.ctx = wx.createCameraContext();
  },

  detached() {
    this.ctx = null;
  },

  methods: {
    /**
     * 开始录像
     */
    handleStartRecord() {
      this.ctx.startRecord({
        success: (res) => {
          console.log('startRecord');
        }
      })
    },

    /**
     * 停止录像
     */
    handleStopRecord() {
      this.ctx.stopRecord({
        success: (res) => {
          this.triggerEvent('stoprecord', res);
        }
      });
    }
  }
})
