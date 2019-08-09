var cc = getApp().globalData.ccsdk;

Page({

    data: {},

    onLoad: function () {
        // cc.live.setDebug(true);
        console.warn("Tip：获得场景视频微信小程序Demo，请使用真机测试推流端、观看直播、观看回放，开启设备音视频权限，开启微信公众平台小程序“实时播放音视频流”、“实时录制音视频流”功能。");
    },

    //推流端
    bindPublisher: function () {
        wx.navigateTo({
            url: "../publisher/login/login"
        });
    },

    //观看直播
    bindPlayer: function () {
        wx.navigateTo({
            url: "../live/login/login"
        });
    },

    bindReplayer: function () {
        wx.navigateTo({
            url: "../replay/login/login"
        });
    }

});