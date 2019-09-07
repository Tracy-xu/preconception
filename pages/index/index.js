Page({
  data: {
    visible: true
  },

  onLoad() {
    this.ctx = wx.createCameraContext()
  },

  startRecord() {
    this.ctx.startRecord({
      success: (res) => {
        console.log('startRecord')
      }
    })
  },

  stopRecord() {
    this.ctx.stopRecord({
      success: (res) => {
        console.log(res.tempThumbPath);
        
        this.setData({
          src: res.tempThumbPath,
          videoSrc: res.tempVideoPath
        });

        this.setData({
          visible: false
        });
      }
    });
  },
  
  error(e) {
    console.log(e.detail)
  }
})