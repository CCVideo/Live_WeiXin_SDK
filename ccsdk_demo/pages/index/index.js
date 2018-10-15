var cc = getApp().globalData.ccsdk;

Page({

    data: {},

    onLoad: function () {
        cc.live.setDebug(true);
    },

    //推流端
    bindPublisher: function () {
        wx.navigateTo({
            url: '../publisher/login/login'
        });
    },

    //观看直播
    bindPlayer: function () {
        wx.navigateTo({
            url: '../live/login/login'
        });
    },

    bindReplayer: function () {
        wx.navigateTo({
            url: '../replay/login/login'
        });
    }

});