import Axios from '../../common/axios/config.js';

let client_id = 'myk-wx';
let client_secret = 'dcdd0330591ad3da2db9b3aca86168eb';

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

let loginByOpenId = (authId) => {
  return Axios.post(`/auth/oauth/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=openid&scope=all&authId=${authId}`, {},{ headers: { isAuth:false}}).then(v => {
    console.log("setting auth to localStorage by password loginByOpenId");
    let auth = v;
    wx.setStorageSync('token', auth.access_token);
    wx.setStorageSync('refreshToken', auth.refresh_token);
    wx.setStorageSync('expiresIn', auth.expires_in);
  }).then(v=>{
    setRefresh();
  });
};

let bind = (authId) => {
  return Axios.post(`/auth/social/bind?authId=${authId}`);
};

let unBind = () => {
  return Axios.post(`/auth/social/unbind?providerId=wx`);
};

let loginByPassword = (username, password, authId) => {
  return Axios.post(`/auth/oauth/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=password&scope=all&username=${username}&password=${password}`, {}, { headers: { isAuth: false } }).then(v => {
    console.log(v);
    console.log("setting auth to localStorage by password loginByPassword");
    let auth = v;
    wx.setStorageSync('token', auth.access_token);
    wx.setStorageSync('refreshToken', auth.refresh_token);
    wx.setStorageSync('expiresIn', auth.expires_in);
  }).then(v => {
    bind(authId).then(v=>{
      setRefresh();
    });
  })
};

let login = (username, password) => {
  return new Promise((resolve, reject) => {
    wx.login({
      success: res => {
        Axios.post(`/auth/social/auth/wx?code=${res.code}`, {}, { headers: { isAuth: false } }).then(v => {
          console.log("get social message from service");
          let social = v;
          if(social.nextStep=='signIn'){
            loginByOpenId(social.authId).then(v=>{
              resolve(v);
            }).catch(v=>{
              reject(v);
            });
          }else if(social.nextStep=='signUp'){
            if(username!=null&&password!=null){
              loginByPassword(username,password,social.authId).then(v=>{
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

let updatePhoto = (photo) => {
  return Axios.put('/user/user/photo',{photo:photo});
};



export { login, getUser, getStudent, getTeacher, unBind,updatePhoto}
