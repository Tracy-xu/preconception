import axios from '../../common/axios/config.js';

/**
 * 上传
 */
export function upload(type, path) {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: `https://api.meiyike.cn/file/upload/${ type }/binary`,
      filePath: path,
      name: 'file',
      formData: {
        'user': 'test'
      },
      success(res) {
        resolve(JSON.parse(res.data));
      }
    });
  });
}
