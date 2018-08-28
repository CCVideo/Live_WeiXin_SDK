# 云直播微信小程序推流SDK开发指南

版本：1.0.0
日期：2018年8月23日

## 1.概述
云直播微信小程序推流 SDK 是适用于微信小程序平台的云直播直播SDK，使用此SDK可以与CC视频云直播进行对接，在微信小程序中使用云直播推流端的功能。

### 1.1 功能特性

|            功能                            | 描述      |
| :--------------------------------------- | :------- |
| 视频推流	 | 支持视频推流	 |
|聊天| 支持在直播中进行聊天|
| 美颜	 | 支持美颜功能|
|自定义清晰度|支持设置标清和高清直播|
|横竖屏|支持手机横屏或竖屏模式直播|
| 前后摄像头切换|	支持手机前后摄像头切换直播|
|获取在线人数|	支持获取直播间在线人数|

### 1.2 阅读对象
本文档为技术文档，需要阅读者：
* 具备基本的微信小程序发能力
* 准备接入CC视频云直播推流SDK功能
* 对CC云直播产品使用方法有基础的了解，[使用帮助地址](http://doc.bokecc.com/live/manual/introduction/)。
* 微信公众平台：[https://mp.weixin.qq.com/](https://mp.weixin.qq.com/)
* 微信公众平台小程序开发文档：[https://developers.weixin.qq.com/miniprogram/dev/quickstart/basic/getting-started.html](https://developers.weixin.qq.com/miniprogram/dev/quickstart/basic/getting-started.html)

## 2.开发准备

### 2.1 开发环境
* 微信开发者工具: 微信小程序开发IDE
* 微信公众平台小程序开发者账号: 开发账号

### 2.2 开发配置
微信小程序直播推流SDK中使用了live-pusher组件，需要开启小程序的“实时播放音视频流”、“实时录制音视频流”功能，登陆微信公众平台小程序开发平台 - 设置 - 接口设置 - 开启实时播放音视频流、实时录制音视频流。

### 2.3 配置服务器域名
登陆微信公众平台小程序开发平台 - 设置 - 开发者设置 - 服务器域名 - 配置服务器信息

```
request合法域名
https://view.csslcloud.net
https://zeus.csslcloud.net
https://eva.csslcloud.net
socket合法域名	
wss://io-cc1.csslcloud.net
wss://io-cc2.csslcloud.net
wss://sio-1.csslcloud.net
wss://sio-2.csslcloud.net
wss://sio-3.csslcloud.net
wss://sio-4.csslcloud.net
wss://io.csslcloud.net
downloadFile合法域名	
https://image.csslcloud.net
```

### 3.快速集成

微信小程序直播推流SDK以小程序插件的形式提供接口服务，无需下载安装。
微信小程序插件使用参考：[https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/using.html](https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/using.html)

### 3.1 添加插件

登陆微信公众平台小程序开发平台 - 设置 - 第三方服务 - 插件管理 - 添加插件 - 搜索：(插件名称：WXCCLive)或(appid：wxf7200395f7f6b071) - 添加

### 3.2 引入插件代码包

app.json文件中加入plugins字段

```json
{
  "pages": [
    "pages/live/live",
    "pages/publisher/publisher"
  ],
  "window": { 
  },
  "plugins": {
    "ccsdk": {
      "version": "1.0.0",
      "provider": "wxf7200395f7f6b071"
    }
  }
}
```

version：由于文档更新局限性，插件版本请使用最新版本，登陆微信公众平台小程序开发平台 - 设置 - 第三方服务 - 插件管理 - WXCCLive - 详情 - 基本信息 - 更新记录，查询插件最新版本。

（微信小程序2018.05.15 更新日志：新增 小程序使用的插件有更新时，在控制台提示插件更新）

### 3.3 使用插件的 js 接口

在js文件中引入ccsdk模块，ccsdk直播推流的方法和事件在publisher对象中，使用ccsdk.publisher.init方法初始化直播推流。

```javascript
var ccsdk = requirePlugin('ccsdk');
cc.publisher.init({
  userId: userId,
  roomId: roomId,
  userName: userName,
  password: password,
  wx: wx,
  success: function (res) {
    console.log('登录成功回掉', res);
  },
  fail: function (res) {
    console.log('登录失败回掉', res);
  }
});
```

参数说明：

|       参数     |       说明      |
| :------------- | :-------------  |
| userId	 | 用户 id |
| roomId         | 直播间id |
| userName	 | 用户名称 |
| password	 | 需要密码验证方式时 |
| wx             |微信全局对象|
| success |初始化成功回掉函数，可选|
| fail |初始化失败回掉函数，可选|

### 3.4 配置直播模块

在wxml中创建live-pusher组件，id为publisher，src的值绑定为publisherUrl。

```html
<live-pusher id="publisher" src="{{publisherUrl}}" mode="HD"/>
```

在js文件data对象中添加publisherUrl属性，在onLoad中调用cc.publisher.configLivePublisher(this, wx)方法配置live-pusher组件

```javascript
var ccsdk = requirePlugin('ccsdk');
Page({
  data: {
    //live-pusher直播推流地址
    publisherUrl: ''
  },
  onLoad: function () {
    //返回live-pusher实例
    this.ctx = cc.publisher.configLivePublisher(this, wx);
  },
})
```

当用户调用ccsdk.publisher.init初始化完成，ccsdk会将观看直播链接赋值给publisherUrl，并根据id="publisher"返回live-pusher实例。
live-pusher组件的原生属性，事件，方法等功能均可正常使用，参考微信小程序文档：[https://developers.weixin.qq.com/miniprogram/dev/component/live-pusher.html](https://developers.weixin.qq.com/miniprogram/dev/component/live-pusher.html)
（如原生方法与ccsdk方法重复，推荐使用ccsdk封装的方法，避免兼容问题）

### 3.5 开始推流

调用cc.publisher.liveStart方法开始推流。

```javascript
cc.publisher.liveStart({
  success: function (res) {
    console.log('开始直播成功回掉', res);
  },
  fail: function (res) {
    console.log('开始直播失败回掉', res);
  }
});
```

### 3.6 cclive-publisher组件

* 为了简化用户开发，ccsdk-demo中将live-pusher组件封装成自定义组件，推荐用户使用cclive-publisher进行直播推流开发。
* 自定义组件使用方法：
1. 将components文件内容拷贝到小程序项目根目录
2. 在json文件中引入自定义组件

```json
{
  "usingComponents": {
    "cclive-publisher": "../../../components/publisher/cclive-publisher/cclive-publisher"
  }
}
```

3. 在wxml文件中创建cclive-publisher组件

```html
<cclive-publisher ccwidth="640rpx" ccheight="600rpx" /> 
```

4. 在components/publisher/cclive-publisher/cclive-publisher.js文件中引入ccsdk

```javascript
var cc = require('plugin/ccsdk');
```

5. 至此就可以调用ccsdk.publisher.init方法初始化直播，调用ccsdk.publisher.liveStart方法开始推流

cclive-publisher自定义组件属性

|       属性名     |     类型     |          默认值        |        说明         |
| :------------- | :-------------  | :-------------  | :-------------  |
|muted|	Boolean|	false|	是否静音|
|orientation|	String	|vertical	|vertical，horizontal	|
|beauty|	Number	|0|	美颜|
|whiteness|	Number|	0	|美白|
|aspect	|String	|9:16|	宽高比，可选值有 3:4, 9:16|
|waitingImage|	String|	|	进入后台时推流的等待画面|
|ccwidth|String|100%|组件宽度|
|ccheight|String|100%|组件高度|
|ccpostion|String|absolute|定位|
|header|String|visible|是否显示主播昵称、在线人数，可选值 visible，hidden|
|chat|String|visible|是否显示聊天|
|control|String|visible|是否显示控制按钮组|

cclive-publisher自定义组件事件

|     事件     |     参数类型     |        说明         |
| :------------- | :-------------  | :-------------  |
|bindstatechange| EventHandle|状态变化事件，detail = {code}|
|bindnetstatus|EventHandle|网络状态通知，detail = {info}|
|binderror	|EventHandle	|	渲染错误事件，detail = {errMsg, errCode}|
|bindSetCamera| EventHandle |点击自定义组件切换摄像头时触发此事件 |
|bindSetSound| EventHandle |点击自定义组件静音按钮时触发此事件 |
|bindSetBeauty| EventHandle |点击自定义组件美颜按钮时触发此事件 |
|bindClose| EventHandle |点击自定义组件关闭按钮时触发此事件 |

### 3.7 快速集成说明

完成上面的步骤后，基本上我们就能够使用CC的SDK进行推流了，也就基本完成了CC直播的核心功能的集成。后续在第4节会对CC直播推流SDK提供的其他的功能特性的使用做详细的说明。

## 4. 功能使用

大部分功能基于ccsdk自定义的cclive-publisher组件，如用户未使用cclive-publisher组件，请查阅微信小程序开发文档中的属性、事件、方法进行开发。

### 4.1 切换摄像头

```
ccsdk.publisher.setSwitchCamera();
```

### 4.2 静音

```js
// b为boolean类型，true为静音，false为非静音
ccsdk.publisher.setMuted(b);
```

### 4.3 美颜

```js
// n为number类型，取值范围0-10
ccsdk.publisher.setBeauty(n);
```

### 4.4 美白

```
// n为number类型，取值范围0-10
ccsdk.publisher.setWhiteness(n);
```

### 4.5 开始直播

```js
ccsdk.publisher.liveStart({
  success: function (res) {
    console.log('开始直播成功回掉', res);
  },
  fail: function (res) {
    console.log('开始直播失败回掉', res);
  }
});
```

### 4.6 停止直播

```
ccsdk.publisher.liveStop({
  success: function (res) {
    console.log('停止直播成功回掉', res);
  },
  fail: function (res) {
    console.log('停止直播失败回掉', res);
  }
});
```

### 4.7 发送公聊

```
// msg为string类型，消息内容
ccsdk.publisher.sendPublicChatMsg(msg);
```

### 4.8 发送私聊

```js
//发送私聊， touserid:接收者的viewerid，tousername:接收者的viewername，msg:消息内容
ccsdk.publisher.sendPrivateChatMsg(touserid, tousername, msg);
```

### 4.9 获取直播间人数

```
ccsdk.publisher.on('room_user_count', function (data) {
  console.log('room_user_count', data);
});
```

### 4.10 设置宽高比

```js
// 可选值：'3:4'，'9:16'
ccsdk.publisher.setAspect('3:4');
```

### 4.11 设置宽高比

```
// 可选值：'SD'，'HD'
ccsdk.publisher. setResolution('SD');
```

### 4.12 设置宽高比

```
// 'vertical'，'horizontal'
ccsdk.publisher. setOrientation('vertical');
```

## 5.API查询

详见 api/index.html

## 6.Q&A

### 6.1 版本兼容
* 微信开发工具：建议使用 1.02.1808100 及以上版本
* 调试基础库：建议使用 2.2.2 及以上版本
* 微信：建议使用 6.7.0 及以上版本

### 6.2 自定义组件使用说明
* 自定义组件封装在ccsdk_demo/components文件下,用户可以直接复制并使用，components/img有所有的UI资源。
* 需要注意自定义组件均使用了ccsdk插件，需要用户配置插件路径。ccsdk_demo直接在小程序app.js中引用了插件，并且赋值给globalData。
* 尽量避免修改自定义组件中的内容，可以适当增加，避免减少。因为WXCCLive插件需要自定义组件提供部分数据支持。
* 如果用户需要的功能自定义组件已经封装，推荐使用封装好的自定义组件，否则可能会导致某些功能异常。




