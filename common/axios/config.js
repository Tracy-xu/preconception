import axios from './axios.min.js';
axios.defaults.baseURL = 'https://api.meiyike.cn';
axios.defaults.headers.post['Content-Type'] = 'application/json';

const Axios = axios.create({
  timeout: 10000,
  responseType: 'json',
  withCredentials: true
});

Axios.defaults.adapter = function (config) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.url,
      method: config.method,
      data: config.data,
      header: config.headers,
      success: (res) => {
        if(res.statusCode>299||res.statusCode<200){
          reject(res);
        }else{
          resolve(res)
        }
      },
      fail: (err) => {
        return reject(err)
      }
    });
  });
};

Axios.interceptors.request.use((config) => {
  let token = wx.getStorageSync('token');
  if (config.headers.isAuth !== false && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, error => Promise.reject(error));

Axios.interceptors.response.use(res => res.data, (error) => {
  // if (error.message.indexOf('timeout') > -1) {
  //   Message({
  //     message: '请求超时,请检查网络',
  //     type: 'warning',
  //   });
  // }

  if (error && error.data.message) {
    switch (error.status) {
      case 401:
        break;
      case 404:
        break;
      case 500:
        wx.showToast({
          title: error.data.message,
          icon: 'none',
          duration: 2000
        });
        break;
      default:
        wx.showToast({
          title: error.data.message,
          icon: 'none',
          duration: 2000
        });
    }
  }

  return Promise.reject(error);
});

export default Axios;