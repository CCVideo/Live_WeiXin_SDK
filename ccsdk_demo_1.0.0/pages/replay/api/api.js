var cc = getApp().globalData.ccsdk;

Page({

    data: {
        userId: '',
        roomId: '',
        recordId: '',
        viewername: '',
        viewertoken: '',
        autoplay: true,
        duration: 0,
        controls: true,
        max: 100,
        min: 0,
        range: [0.5, 0.8, 1.0, 1.25, 1.5]
    },

    bindInit: function () {
        var opts = {
            userId:this.data.userId,
            roomId:this.data.roomId,
            recordId:this.data.recordId,
            viewername: this.data.viewername,
            viewertoken: this.data.viewertoken,
            wx: wx,
            success: function (res) {
                console.log(res);
                // wx.navigateTo({
                //     url:'/pages/replay/test/test'
                // })
            },
            fail: function (res) {
                console.log(res);
            }
        };
        cc.replay.init(opts);
    },

    onLoad: function (options) {
        console.log(cc);

        cc.replay.setDebug(true);

        this.onceTimeupdate = true;

        cc.replay.on('player_load', function (data) {
            console.log('player_load', data);
        });

        cc.replay.on('room_info', function (data) {
            console.log('room_info', data);
        });

        cc.replay.on('template_info', function (data) {
            console.log('template_info', data);
        });

        cc.replay.on('pages_info', function (data) {
            console.log('pages_info', data);
        });

        cc.replay.on('questions_info', function (data) {
            console.log('questions_info', data);
        });

        cc.replay.on('answers_info', function (data) {
            console.log('answers_info', data);
        });

        cc.replay.on('chat_msg_info', function (data) {
            console.log('chat_msg_info', data);
        });

        cc.replay.on('chat_msg_sync', function (data) {
            console.log('chat_msg_sync', data);
        });
    },

    onTimeupdate: function (e) {
        if (this.onceTimeupdate) {
            this.setData({
                max: e.detail.duration
            });
            this.onceTimeupdate = false;
        }
    },

    onWaiting: function (e) {
        console.log(e);
    },

    onPlay: function (e) {
        console.log(e);
    },

    onPause: function (e) {
        console.log(e);
    },

    onEnded: function (e) {
        console.log(e);
    },

    onFullscreenchange: function (e) {
        console.log(e);
    },

    onError: function (e) {
        console.log(e);
    },

    bindPlaybackRate: function (e) {
        var rate = this.data.range[e.detail.value];
        cc.replay.playbackRate(rate);
    },

    bindChange: function (e) {
        cc.replay.seek(e.detail.value);
    },

    bindQuit: function () {
        cc.replay.quit();
    },

    bindPlay: function () {
        cc.replay.play();
    },

    bindPause: function () {
        cc.replay.pause();
    },

    bindRequestFullScreen:function(){
        cc.replay.requestFullScreen();
    },

    bindExitFullScreen:function(){
        cc.replay.exitFullScreen();
    },

    onReady: function () {

    },

    onShow: function () {

    },

    onHide: function () {

    },

    onUnload: function () {

    },

    onPullDownRefresh: function () {

    },

    onReachBottom: function () {

    },

    onShareAppMessage: function () {

    }
});
