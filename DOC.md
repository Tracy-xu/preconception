## 框架 

### 接口

```
import API from '../../api/index.js';
```

```
API.Auth.login();
```

### 路由

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

### 页面

页面在 pages 文件夹中定义。所有的页面需要在根目录 app.json 中注册。

```
{
  "pages": [
    "pages/question/list/index",
    "pages/auth/index",
    "pages/question/create/index",
    "pages/question/edit/index",
    "pages/question/detail/index",
    "pages/preview/list/index",
    "pages/preview/detail/index",
    "pages/preview/exercises/index",
    "pages/analysis/index",
    "pages/profile/index",
    "pages/record/index",
    "pages/my-class/index"
  ]
}
```

### 组件

组件在 components 文件夹中定义。页面中要想使用组件，需要在页面 json 文件中注册。

```
{
  "usingComponents": {
    "tabbar": "../../../components/common/tabbar/index"
  }
}
```

### 工具类

在 utils 文件夹。

### 插件

在 plugins 文件夹。采用官方 weui。

## 小程序技巧

### 设置 Data

```
this.setData({
  userInfo: e.detail.userInfo,
  hasUserInfo: true
});
```
