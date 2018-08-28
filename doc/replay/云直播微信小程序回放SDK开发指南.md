# 云直播微信小程序回放SDK开发指南

版本：1.0.0
日期：2018年8月23日

## 1.概述
云直播微信小程序回放 SDK 是适用于微信小程序平台的云直播回放SDK，使用此SDK可以与CC视频云直播进行对接，在微信小程序中使用云直播回放端的功能。

### 1.1 功能特性

|            功能                            | 描述      |
| :--------------------------------------- | :------- |
|视频|支持观看回放视频|
|文档|支持观看回放文档和画板|
|聊天|支持聊天回放|
|问答|支持问答回放|

### 1.2 阅读对象
本文档为技术文档，需要阅读者：
* 具备基本的微信小程序发能力
* 准备接入CC视频云直播回放SDK功能
* 对CC云直播产品使用方法有基础的了解，[使用帮助地址](http://doc.bokecc.com/live/manual/introduction/)。
* 微信公众平台：[https://mp.weixin.qq.com/](https://mp.weixin.qq.com/)
* 微信公众平台小程序开发文档：[https://developers.weixin.qq.com/miniprogram/dev/quickstart/basic/getting-started.html](https://developers.weixin.qq.com/miniprogram/dev/quickstart/basic/getting-started.html)

## 2.开发准备

### 2.1 开发环境
* 微信开发者工具: 微信小程序开发IDE
* 微信公众平台小程序开发者账号: 开发账号

### 2.2 开发配置
微信小程序直播回放demo中使用了video组件。

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

微信小程序直播回放SDK以小程序插件的形式提供接口服务，无需下载安装。
微信小程序插件使用参考：[https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/using.html](https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/using.html)

### 3.1 添加插件

登陆微信公众平台小程序开发平台 - 设置 - 第三方服务 - 插件管理 - 添加插件 - 搜索：(插件名称：WXCCLive)或(appid：wxf7200395f7f6b071) - 添加

### 3.2 引入插件代码包

app.json文件中加入plugins字段

```json
{
  "pages": [
    "pages/replay/replay"
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

在js文件中引入ccsdk模块，ccsdk观看回放的方法和事件在replay对象中，使用ccsdk.replay.init方法初始化观看回放。

```javascript
var ccsdk = requirePlugin('ccsdk');
cc.replay.init({
  userId: userId,
  roomId: roomId,
  recordId: recordId,
  viewername: viewername,
  viewertoken: viewertoken,
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
| recordId         | 回放id |
| viewername	 | 用户名称 |
| viewertoken	 | 需要密码验证方式时 |
| wx             |微信全局对象|
| success |初始化成功回掉函数，可选|
| fail |初始化失败回掉函数，可选|

### 3.4 配置回放模块

在wxml中创建video组件，id为player，src的值绑定为playerUrl。

```html
<video id="player" src="{{playerUrl}}" />
```

在js文件data对象中添加playerUrl属性，在onLoad中调用cc.replay.configPlayer(this, wx)方法配置video组件

```javascript
var ccsdk = requirePlugin('ccsdk');
Page({
  data: {
    //video观看回放地址
    playerUrl: ''
  },
  onLoad: function () {
    //返回video组件实例
    this.ctx = cc.replay.configPlayer(this, wx);
  },
})
```

当用户调用ccsdk.replay.init初始化完成，ccsdk会将观看回放链接赋值给playerUrl，并根据id="player"返回video实例。
video组件的原生属性，事件，方法等功能均可正常使用，参考微信小程序文档：[https://developers.weixin.qq.com/miniprogram/dev/component/video.html](https://developers.weixin.qq.com/miniprogram/dev/component/video.html)
（如原生方法与ccsdk方法重复，推荐使用ccsdk封装的方法，避免兼容问题）

### 3.5 开始播放

调用cc.replay.play方法开始播放。

```javascript
cc.replay.play();
```

### 3.6 player组件

* 为了简化用户开发，ccsdk-demo中将video组件封装成自定义组件，推荐用户使用player组件进行观看回放开发。
* 自定义组件使用方法：
1. 将components文件内容拷贝到小程序项目根目录
2. 在json文件中引入自定义组件

```json
{
  "usingComponents": {
    "player": "../../../components/replay/player/player"
  }
}
```

3. 在wxml文件中创建player组件

```xml
<player player-class="player"></player> 
```

```css
.player{
  width:750rpx;
  height:422rpx;
}
```

4. 在components/replay/player/player.js文件中引入ccsdk

```javascript
var cc = require('plugin/ccsdk');
```

5. 至此就可以调用ccsdk.replay.init方法初始化观看回放，调用ccsdk.replay.play()方法播放回放

replay自定义组件属性和方法参考player自定义组件源码，可以根据自己需求进行扩展，尽量避免删减，插件需要封装好的自定义组件提供相应的数据支持。

### 3.7 文档画板模块


ccsdk插件提供了文档画板自定义组件`<drawingBoard></drawingBoard>`，使用文档画板功能是需要引入ccsdk插件及其提供的自定义组件，在wxml中使用即可。

在需要使用drawingBoard组件的Page页面的json文件中引入组件

```json
{
  "navigationBarTitleText": "观看直播",
    "usingComponents": {
      "drawingBoard":"plugin://ccsdk/drawingBoardReplay"
    }
}
```

在wxml文件中使用 drawingBoard 组件

```xml
<drawingBoard db-class="drawingBoard"></drawingBoard>
```

```css
.drawingBoard{
  width:750rpx;
  height:422rpx;
}
```

Tip
1. 可以通过db-class属性指定类名，在wxss通过类名选择器选定组件，绑定样式。
2. drawingBoard 文档画板自定义组件基于canvas组件，层级属性与canvas一致，是最高的，不能通过 z-index 控制层级。
3. 注意ccsdk插件提供的组件名称为drawingBoardReplay，用户应用可自定义名称。
4. drawingBoard 文档画板自定义组件基于canvas组件，如果需要在文档画板上添加元素，只能在drawingBoard组件中使用cover-view和cover-image

```html
<drawingBoard>
    <cover-view><cover-view/>
    <cover-image><cover-image/>
</drawingBoard>
```

### 3.8 快速集成说明

完成上面的步骤后，基本上我们就能够使用CC的SDK进行观看回放了，也就基本完成了CC直播的核心功能的集成。后续在第4节会对CC直播回放SDK提供的其他的功能特性的使用做详细的说明。

## 4. 功能使用

功能使用时相关的核心类：ccsdk.replay（观看回放核心对象），ccsdk.replay.on（观看放回事件方法）。

### 4.1 播放

```js
// 播放视频，返回true调用成功，返回false发送失败
ccsdk.replay.play();
```

### 4.2 跳转到指定位置

```js
//跳转到指定位置，单位 s
ccsdk.replay.seek(60);
```

### 4.3 倍速播放

```js
//倍速播放，支持的倍率有 0.5/0.8/1.0/1.25/1.5
ccsdk.replay.playbackRate(n);
```

### 4.4 全屏

```js
//可传入{direction}参数（1.7.0起支持），详见video组件文档
ccsdk.replay.requestFullScreen(dir);
```

### 4.5 获取房间信息

```
ccsdk.replay.on('room_info', function (data) {
  console.log('room_info', data);
});
```

### 4.6 问题信息

```
ccsdk.replay.on('questions_info', function (data) {
  console.log('questions_info', data);
});
```

### 4.7 回答信息

```
ccsdk.replay.on('answers_info', function (data) {
  console.log('answers_info', data);
});
```

### 4.8 同步现实聊天信息

```
ccsdk.replay.on('chat_msg_sync', function (data) {
  console.log('chat_msg_sync', data);
});
```

## 5.API查询

详见 api/index.html

## 6.Q&A

### 6.1 版本兼容
* 微信开发工具：建议使用 1.02.1808100 及以上版本
* 调试基础库：建议使用 2.2.2 及以上版本
* 微信：建议使用 6.7.0 及以上版本
 
### 6.3 自定义组件使用说明
* 自定义组件封装在ccsdk_demo/components文件下,用户可以直接复制并使用，components/img有所有的UI资源。
* 需要注意自定义组件均使用了ccsdk插件，需要用户配置插件路径。ccsdk_demo直接在小程序app.js中引用了插件，并且赋值给globalData。
* 尽量避免修改自定义组件中的内容，可以适当增加，避免减少。因为WXCCLive插件需要自定义组件提供部分数据支持。
* 如果用户需要的功能自定义组件已经封装，推荐使用封装好的自定义组件，否则可能会导致某些功能异常。


