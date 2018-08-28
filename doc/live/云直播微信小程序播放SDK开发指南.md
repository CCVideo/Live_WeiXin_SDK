#云直播微信小程序播放SDK开发指南

版本：1.0.0
日期：2018年8月23日

## 1.概述
云直播微信小程序播放 SDK 是适用于微信小程序平台的云直播播放SDK，使用此SDK可以与CC视频云直播进行对接，在微信小程序中使用云直播观看端的功能。

### 1.1 功能特性
|            功能                            | 描述      |
| :--------------------------------------- | :------- |
| 视频	 | 支持直播视频播放	 |
| 文档 | 文档及画笔展示，暂不支持ppt动画   |
|聊天| 支持公聊和私聊模式|
| 问答	 | 支持公开问答和私密问答	|
|公告| 支持获取公告信息|
|线路切换|支持选择直播流线路	|
|音频模式	|直播时支持选择观看纯音频模式|
|获取在线人数|支持获取直播间在线人数|

### 1.2 阅读对象
本文档为技术文档，需要阅读者：
* 具备基本的微信小程序发能力
* 准备接入CC视频的直播SDK观看功能
* 对CC云直播产品使用方法有基础的了解，[使用帮助地址](http://doc.bokecc.com/live/manual/introduction/)。

## 2.开发准备

### 2.1 开发环境
* 微信开发者工具: 微信小程序开发IDE
* 微信公众平台小程序开发者账号: 开发账号
* 微信公众平台：[https://mp.weixin.qq.com/](https://mp.weixin.qq.com/)
* 微信公众平台小程序开发文档：[https://developers.weixin.qq.com/miniprogram/dev/quickstart/basic/getting-started.html](https://developers.weixin.qq.com/miniprogram/dev/quickstart/basic/getting-started.html)

### 2.2 开发配置
云直播微信小程序播放SDK中使用了live-player组件，需要开启小程序的“实时播放音视频流”、“实时录制音视频流”功能，登陆微信公众平台小程序开发平台 - 设置 - 接口设置 - 开启实时播放音视频流、实时录制音视频流。

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

## 3.快速集成

云直播微信小程序播放SDK以小程序插件的形式提供接口服务，无需下载安装。
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

在js文件中引入ccsdk模块，ccsdk观看直播的方法和事件在live对象中，使用ccsdk.live.init方法初始化观看直播。

```javascript
var ccsdk = requirePlugin('ccsdk');
ccsdk.live.init({
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
| password	 | 需要密码验证方式时，可选 |
| wx             |微信全局对象|
| forcibly       | 强制登录，可选 |
| success |初始化成功回掉函数，可选|
| fail |初始化失败回掉函数，可选|

### 3.4 配置视频模块

在wxml中创建live-player组件，id为player，src绑定playerUrl的值。

```html
<live-player id="player" src="{{playerUrl}}" mode="live" autoplay/>
```

在js文件data对象中添加PlayerUrl属性，在onLoad中调用configLivePlayer(this, wx)方法配置live-player组件

```javascript
var ccsdk = requirePlugin('ccsdk');
Page({
  data: {
    //live-player直播观看地址
    playerUrl: ''
  },
  onLoad: function () {
    //返回live-player实例
    this.ctx = ccsdk.live.configLivePlayer(this, wx);
  },
})
```

当用户调用ccsdk.live.init初始化完成，ccsdk会将观看直播链接赋值给playerUrl，并根据id="player"返回live-player实例。


### 3.5 文档画板模块


ccsdk插件提供了文档画板自定义组件`<drawingBoard></drawingBoard>`，使用文档画板功能是需要引入ccsdk插件及其提供的自定义组件，在wxml中使用即可。

在需要使用drawingBoard组件的Page页面的json文件中引入组件

```json
{
  "navigationBarTitleText": "观看直播",
    "usingComponents": {
      "drawingBoard":"plugin://ccsdk/drawingBoard"
    }
}
```

在wxml文件中使用 drawingBoard 组件

```html
<drawingBoard width="100%" height="423rpx"></drawingBoard>
```

drawingBoard 文档画板组件属性方法说明

|  属性名| 类型 | 默认值 |说明| 最低版本|
| --- | --- | --- | --- | --- |
| width |  String| 700rpx | 组件宽度 |2.0.9|
| height | String | 450rpx | 组件高度|2.0.9|

Tip

1. drawingBoard 文档画板自定义组件基于canvas组件，层级属性与canvas一致，是最高的，不能通过 z-index 控制层级。

2. drawingBoard 文档画板自定义组件基于canvas组件，如果需要在文档画板上添加元素，只能在drawingBoard组件中使用cover-view和cover-image

```html
<drawingBoard>
    <cover-view><cover-view/>
    <cover-image><cover-image/>
</drawingBoard>
```

### 3.6 快速集成说明
完成上面的步骤后，基本上我们就能够观看到直播间的视频画面和文档画面了，也就基本完成了CC直播的核心功能的集成，即观看视频和观看文档的功能。后续在第4节会对CC直播SDK提供的其他的功能特性的使用做详细的说明。

## 4.功能使用

功能使用时相关的核心类：ccsdk.live（观看直播核心对象），ccsdk.live.on（观看直播事件方法）。

### 4.1 聊天功能

聊天功能分为公共聊天和私聊，聊天时主动调用的方法在ccsdk.live对象上，相关方法如下：

|       API     |       说明      |
| :------------- | :-------------  |
| sendPublicChatMsg(msg)	 | 发送公聊，msg:消息内容，聊天信息必须是字符串并小于300字且不能为空。 |
| sendPrivateChatMsg(touserid,tousername,msg) | 发送私聊， touserid:接收者的viewerid，tousername:接收者的viewername，msg:消息内容 |

聊天功能的核心回调事件，相关的回调方法如下：

收到公聊和自己发送的公聊

```javascript
cc.live.on("chat_message",function(data){
    // console.log(data);
    //{
    //   "userid": "4ccd73b2fb1a4b63be1043b6c4c225dc", // 发送者id
    //   "username": "name",   // 发送者名字
    //   "userrole": "student",   // 发送者身份
    //   "useravatar": "img",   // 发送者头像
    //   "msg": "rrr",   // 消息内容
    //   "time": "16:45:08",   // 发送时间
    //   "usercustommark": ""  // 聊天自定义参数
    // }
})
```

收到自己发送的私聊，如果用户被禁言可以通过此方法接收自己发送的聊天信息

```javascript
cc.live.on("private_chat_self",function(data){
    // console.log(data);
    //{
    //   "fromuserid": "7a4715874d504b8db78cb5b77d66b8c8",  // 发送者id
    //   "fromusername": "name",   // 发送者名字
    //   "touserid": "33ed40d2d7b746919219789733b5bdd4",  // 接收者id
    //   "tousername": "第三方士大夫",   // 接收者名字
    //   "msg": "发反反复复",   // 消息内容
    //   "time": "17:22:15"   // 发送时间
    //}
}
```

收到私聊回复

```javascript
cc.live.on("private_chat",function(data){
    // console.log(data);
    //{
    //   "fromuserid": "33ed40d2d7b746919219789733b5bdd4",  // 发送者id
    //   "fromusername": "第三方士夫",  // 发送者名字
    //   "fromuserrole": "student",   // 发送者身份
    //   "touserid": "7a4715874d504b8db78cb5b77d66b8c8",  // 接收者id
    //   "tousername": "name",   // 接收者名字
    //   "msg": "阿斯蒂芬",   // 消息内容
    //   "time": "17:26:24"  // 发送时间
    // }
}
```

### 4.2 问答功能

提问时主动调用的方法在ccsdk.live对象中，相关方法如下：

|       API     |       说明      |
| :------------- | :-------------  |
| sendQuestionMsg(content)|发送问题，content:消息内容|

问答功能的核心回调事件，相关的回调方法如下：

自己发送的问题和别人发送的问题都会从此接口回调回来。

```javascript
cc.live.on("question",function(data){
    // console.log(data);
    // {
    //     "action":"question",  // 提问
    //     "value": {
    //         "userId":"C783F0F7CB77E1F3",  // 提问者id
    //         "userName":"name",   // 提问者名字
    //         "content":"123145",  // 提问内容
    //         "userAvatar":"img",     // 提问者头像
    //         "id":"1B5BBA4826FFE337"   // 问题id
    //     }
    // }
}
```

收到回答

```javascript
cc.live.on("answer",function(data){
    // console.log(data);
    //{
    //    "action":"answer",   // 回答
    //    "value": {
    //        "content":"ghghjgug",   // 回答内容
    //        "isPrivate":0,    // 是否仅提问者可见
    //        "questionId":"1B5BBA4826FFE337",   // 问题id
    //        "questionUserId":"C783F0F7CB77E1F3",   // 提问者id
    //        "userId":"ebadb3d414c3471786d095c93bab8cb5",  // 回答者id
    //        "userName":"www",   // 回答者名字
    //        "userAvatar":"img",    // 回答者头像
    //        "userRole":"publisher"   // 回答者身份
    //    }
    //}
}
```

客户端发布问题回掉事件

```javascript
cc.live.on("publish_question",function(data){
    // console.log(data);
    //{
    //   "action": "publish_question",
    //   "value": {
    //     "questionId": "4F80FC9C1CB96F5D"//问题id
    //   }
    //}
}
```

### 4.3 公告功能

此功能为方法回调功能，相关对象ccsdk.live，相关方法如下：

开始直播后显示公告

```javascript
cc.live.on("announcement_info",function(data){
    // console.log(data);
}
```

发布和修改公告

```javascript
cc.live.on("announcement",function(data){
    // console.log(data);
    //{
    //    action: "release",
    //    announcement: "sdfads1啊"//公告
    //}
}
```

删除公告

```javascript
cc.live.on("announcement",function(data){
    // console.log(data);
}
```

### 4.4 音频模式

此功能为主动调用功能，调用的方法在ccsdk.live对象中，相关方法如下：

|       API     |       说明      |
| :------------- | :-------------  |
|streamMode(mode)| video切换到视频模式，audio只听音频|

### 4.5 获取在线人数

此功能为方法回调功能，相关对象ccsdk.live，相关方法如下：

```javascript
cc.live.on("room_user_count",function(data){
    // console.log(data);
}
```

## 5.更多相关API查询

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

### 6.3 方法、事件使用说明
* 除init外，其他方法需要在登录以后才能成功调用，返回true。
* 通过on方法监听事件必须是唯一的，多个监听只会有一个回掉函数返回事件参数。
* 事件生命周期可以根据后缀判断：

|       事件     |       说明      |
| :------------- | :-------------  |
|'event_log'| 返回历史信息，只有在登录成功返回，跨界面使用此数据建议用户做一下存储转化，传递给其他界面|
|'event_info'| 返回登录成功系列信息，只有在登录成功的时候返回。|
|'event' | 通过用户行为方法触发或定时器实时返回相应事件参数|





