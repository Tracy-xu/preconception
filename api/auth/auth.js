import Axios from '../../common/axios/config.js';

let client_id = 'myk-web';
let client_secret = '12719da91b1745da8d272c6e119f71da';

let interval = null;

let getUser = () => {
  return Axios.get('/user/user');
};

let getStudent = () => {
  return Axios.get('/user/user/student');
};

let getTeacher = () => {
  return Axios.get('/user/user/teacher');
};

let refresh = () => {
  let refresh_token = wx.getStorageSync('refreshToken');
  console.log("refresh token");
  return Axios.post(`/auth/oauth/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=refresh_token&refresh_token=${refresh_token}`).then(v => {
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

let loginByOpenId = (openId) => {
  return Axios.post(`/auth/oauth/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=openid&scope=all&openId=${openId}`, {},{ headers: { isAuth:false}}).then(v => {
    console.log("setting auth to localStorage by password loginByOpenId");
    let auth = v;
    wx.setStorageSync('token', auth.access_token);
    wx.setStorageSync('refreshToken', auth.refresh_token);
    wx.setStorageSync('expiresIn', auth.expires_in);
  }).then(v=>{
    setRefresh();
  });
};

let bind = (openId) => {
  return Axios.post(`/auth/social/bind?openId=${openId}`);
};

let unBind = () => {
  return Axios.post(`/auth/social/unbind?providerId=wxmp`);
};

let loginByPassword = (username, password, openId) => {
  return Axios.post(`/auth/oauth/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=password&scope=all&username=${username}&password=${password}`, {}, { headers: { isAuth: false } }).then(v => {
    console.log(v);
    console.log("setting auth to localStorage by password loginByPassword");
    let auth = v;
    wx.setStorageSync('token', auth.access_token);
    wx.setStorageSync('refreshToken', auth.refresh_token);
    wx.setStorageSync('expiresIn', auth.expires_in);
  }).then(v => {
    bind(openId).then(v=>{
      setRefresh();
    });
  })
};

let login = (username, password) => {
  return new Promise((resolve, reject) => {
    wx.login({
      success: res => {
        Axios.post(`/auth/social/auth/wxmp?code=${res.code}`, {}, { headers: { isAuth: false } }).then(v => {
          console.log("get social message from service");
          let social = v;
          if(social.nextStep=='signIn'){
            loginByOpenId(social.openId).then(v=>{
              resolve(v);
            }).catch(v=>{
              reject(v);
            });
          }else if(social.nextStep=='signUp'){
            if(username!=null&&password!=null){
              loginByPassword(username,password,social.openId).then(v=>{
                resolve(v);
              }).catch(v=>{
                reject(v);
              });
            }else{
              reject(v);
            }
          }else{
            reject(v);
          }
        }).catch(v=>{
          reject(v);
        });
      }
    })
  });
};



export { login, getUser, getStudent, getTeacher, unBind}