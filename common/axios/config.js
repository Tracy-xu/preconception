import axios from './axios.min.js';
// axios.defaults.baseURL = 'http://api.kpg123.com';
axios.defaults.baseURL = 'http://122.112.239.223:13000';
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
      data: config.params,
      success: (res) => {
        return resolve(res)
      },
      fail: (err) => {
        return reject(err)
      }
    });
  });
};

Axios.interceptors.request.use((config) => {
  let token = wx.getStorageSync('token');
  if (token) {
    token = JSON.parse(token);
    config.headers.Authorization = `${token.token_type} ${token.access_token}`;
  }

  return config;
}, error => Promise.reject(error));

Axios.interceptors.response.use(res => res.data, (error) => {
  if (error.message.indexOf('timeout') > -1) {
    Message({
      message: '请求超时,请检查网络',
      type: 'warning',
    });
  }

  if (error && error.response) {
    switch (error.response.status) {
      case 401:
        break;
      case 404:
        break;
      case 500:
        wx.showToast({
          title: error.response.data.message,
          icon: 'none',
          duration: 2000
        });
        break;
      default:
        wx.showToast({
          title: error.response.data.message,
          icon: 'none',
          duration: 2000
        });
    }
  }

  return Promise.reject(error);
});

export default Axios;