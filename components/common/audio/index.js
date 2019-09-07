Component({
  properties: {
    src: {
      type: String,
      value: ''
    }
  },

  data: {
    audioAction: {
      method: 'pause'
    },
    currentTime: 0,
    duration: 0,
    slideValue: 0,
    drag: false,
  },

  methods: {
    handlePlayPause() {
      if (this.data.audioAction.method === 'pause') {
        this.play();
      } else {
        this.pause();
      }
    },

    /**
     * 开始播放
     */
    handleAudioPlayed: function (e) {
      console.log('audio is played')
    },

    /**
     * 播放中
     */
    handleAudioTimeUpdated: function (e) {
      this.setData({
        duration: e.detail.duration
      });

      this.setData({
        currentTime: e.detail.currentTime
      });

      if (!this.data.drag) {
        this.setData({
          slideValue: parseInt(this.data.currentTime / this.data.duration * 100)
        });
      }
    },

    /**
     * 进度条拖拽中
     */
    handleSliderChanging: function(e) {
      this.setData({
        drag: true
      });
    },

    /**
     * 进度条拖拽完成后
     */
    handleSliderChanged: function (e) {
      if (!this.data.duration) {
        return;
      }

      var time = this.data.duration * e.detail.value / 100;

      this.setData({
        audioAction: {
          method: 'setCurrentTime',
          data: time
        }
      });

      this.setData({
        slideValue: e.detail.value
      });

      this.setData({
        drag: false
      });
    },

    /**
     * 播放
     */
    play: function () {
      this.setData({
        audioAction: {
          method: 'play'
        }
      });
    },

    /**
     * 暂停
     */
    pause: function () {
      this.setData({
        audioAction: {
          method: 'pause'
        }
      });
    }
  }
})
