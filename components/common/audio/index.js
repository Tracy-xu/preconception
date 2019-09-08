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
    currentTimeFormat: '00:00',
  },

  methods: {
    handlePlayPause() {
      if (this.data.audioAction.method === 'pause') {
        this.play();
        if (this.data.currentTime === 0) {
          this.setData({
            slideValue: 0
          });
        }
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

      this.setData({
        currentTimeFormat: this.formatSecond(this.data.currentTime)
      });
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
    },

    /**
     * 格式化秒
     */
    formatSecond(second) {
      function leftPad(num) {
        return num > 10 ? num : `0${ num }`;
      }

      if (second < 60) {
        return `00:${ leftPad(parseInt(second)) }`;
      } else {
        const m = Math.floor(second / 60);
        const s = second - m * 60;
        return `${ leftPad(m) } : ${ leftPad(parseInt(s)) }`
      }
    }
  }
})
