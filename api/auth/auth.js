import Axios from '../../common/axios/config.js';

let client_id = 'myk-web';
let client_secret = '12719da91b1745da8d272c6e119f71da';
let hosts = '/auth';

let interval = null;

let getUser = () => {
  return Axios.get('/user/user');
};

let refresh = () => {
  let refresh_token = wx.getStorageSync('refreshToken');
  console.log("refresh token");
  return Axios.post(`${hosts}/oauth/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=refresh_token&refresh_token=${refresh_token}`).then(v => {
    console.log("setting auth to localStorage by refresh");
    let auth = v;
    wx.setStorageSync('token', auth.access_token);
    wx.setStorageSync('refreshToken', auth.refresh_token);
    wx.setStorageSync('expiresIn', auth.expires_in);
  })
};

let setRefresh = () => {
  if (interval == null) {
    let timeout = (wx.getStorageSync('expiresIn') - 2) * 1000;
    console.log(`setting interval ${timeout} millisecond to refresh auth`);
    interval = setInterval(refresh, timeout);
  }
};

let loginByCode = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      success: res => {
        Axios.get(`${hosts}/social/auth/wx?code=${res.code}`).then(v => {
          console.log("setting auth to storage by code login");
          let auth = v;
          wx.setStorageSync('token', auth.access_token);
          wx.setStorageSync('refreshToken', auth.refresh_token);
          wx.setStorageSync('expiresIn', auth.expires_in);
        }).then(v => {
          setRefresh();
          resolve(v);
        }).catch(v=>{
          reject(v);
        });
      }
    })
  });
};

let loginByPassword = (username, password) => {
  return Axios.post(`${hosts}/oauth/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=password&scope=all&username=${username}&password=${password}`).then(v => {
    console.log("setting auth to localStorage by password login");
    let auth = v;
    wx.setStorageSync('token', auth.access_token);
    wx.setStorageSync('refreshToken', auth.refresh_token);
    wx.setStorageSync('expiresIn', auth.expires_in);
  }).then(v => {
    setRefresh();
    console.log("login by password success");
    // loginByCode().catch(v => {
    //   let openId = v.openId;
    //   console.log(`get openId from service openId:${openId}`);
    //   Axios.post(`${hosts}/social/bind`, { parames: { openId } }).then(v => {
    //     console.log(`bind openId to user success`);
    //     resolve();
    //   }).catch(v => {
    //     console.log(`bind openId to user failed`);
    //     reject(v);
    //   });
    // })
  })
};

export { loginByPassword, loginByCode, getUser}