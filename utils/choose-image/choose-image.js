export default function () {
  return new Promise((resolve, reject) => {
    wx.showActionSheet({
      itemList: ['从相册中选中', '拍照'],
      success: (res) => {
        if (res.tapIndex === 0) {
          chooseImage('album');
        } else {
          chooseImage('camera');
        }
      },
      fail: (res) => {
        console.log(res.errMsg, 222)
      }
    });

    function chooseImage(type) {
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: [type],
        success(res) {
          const tempFilePaths = res.tempFilePaths;
          resolve(tempFilePaths);
        }
      });
    }
  });
}