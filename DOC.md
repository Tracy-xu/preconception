## 接口

```
import API from '../../api/index.js';
```

```
API.Auth.login();
```

## 路由

* 路由跳转

```
import router from '../../router/index.js';
```

```
// 编程式导航
wx.navigateTo({
  url: router.home
});
```

```
// 连接
<navigator url="xxx"></navigator>
```

* 路由传参

```
wx.navigateTo({
  url: `${ router.home }?a=1&b=2`
});
```

## 设置 Data

```
this.setData({
  userInfo: e.detail.userInfo,
  hasUserInfo: true
});
```
