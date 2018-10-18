# README

### 云直播微信小程序SDK版本
* 日期：2018年10月16日
* 版本：1.1.1

### ccsdk_demo使用方法
* WXCCLive小程序插件是CC云直播提供的小程序SDK，使用此插件可以快速实现与CC云直播对接。
* ccsdk_demo 是通过WXCCLive插件实现的直播推流、观看直播、观看回放的demo。
* 使用demo需要用户配置 ccsdk_demo/project.config.json appid字段，添加自己的appid。
* 添加配置ccsdk插件后就可以运行使用ccsdk_demo，并参考demo进行二次开发。

1. 推流sdk插件快速使用详见 doc/云直播微信小程序推流SDK开发指南.html
2. 播放sdk插件快速使用详见 doc/云直播微信小程序播放SDK开发指南.html
3. 回放sdk插件快速使用详见 doc/云直播微信小程序播放SDK开发指南.html

### ccsdk_demo目录结构
* components/（自定组件）
    *     img/（静态资源）
    *     live/（观看直播相关自定义组件）
    *     publisher/（推流相关自定义组件）
    *     replay/（观看回放相关自定组件）
* pages/
    *     index/（入口文件）
    *     live/（观看直播页面）
    *     publisher/（推流页面）
    *     replay/（观看回放页面）

### 自定义组件使用说明
* 自定义组件封装在ccsdk_demo/components文件下,用户可以直接复制并使用，components/img有所有的UI资源。
* 需要注意自定义组件均使用了WXCCLive插件，需要用户配置插件路径。ccsdk_demo直接在小程序app.js中引用了插件，并且赋值给globalData。
* 尽量避免修改自定义组件中的内容，可以适当增加，避免减少。因为WXCCLive插件需要自定义组件提供部分数据支持。
* 如果用户需要的功能自定义组件已经封装，推荐使用封装好的自定义组件，否则可能会导致某些功能异常。

### 版本兼容
* 微信开发工具：建议使用 1.02.1809260 及以上版本
* 调试基础库：建议使用 2.3.0 及以上版本
* 微信：建议使用 6.7.2 及以上版本

### 更新记录和升级文档

详见文件夹: update / 升级文档 v1.x.x (2018-xx-xx).html






