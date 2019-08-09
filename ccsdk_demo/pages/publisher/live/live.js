var cc = getApp().globalData.ccsdk;

Page({

    data: {
        soundSwitch: true,
        beautySwitch: true
    },

    onShow: function () {
        //保持常亮状态
        wx.setKeepScreenOn({
            keepScreenOn: true
        });
    },

    onLoad: function (options) {

        //保持常亮状态
        wx.setKeepScreenOn({
            keepScreenOn: true
        });

        if (JSON.stringify(options.data) !== '{}') {

            //接收设置的直播参数
            var data = JSON.parse(options.data);
            console.log(data);
            this.setData({
                beautySwitch: !data.beauty
            });

            start();

            function start() {
                wx.showModal({
                    title: '提示',
                    content: '你确认开始直播吗？',
                    success: function (res) {
                        if (res.confirm) {
                            cc.publisher.liveStart({
                                success: function (res) {
                                    console.log('开始直播成功回调', res);
                                    //配置直播参数
                                    if (data.beauty) {
                                        cc.publisher.setBeauty(8);
                                        cc.publisher.setWhiteness(8);
                                    } else {
                                        cc.publisher.setBeauty(0);
                                        cc.publisher.setWhiteness(0);
                                    }
                                    if (data.camera.position === 'post') {
                                        cc.publisher.setSwitchCamera();
                                    }
                                    cc.publisher.setResolution(data.resolution.resolution);
                                },
                                fail: function (res) {
                                    console.log('开始直播失败回调', res);
                                    wx.navigateBack({
                                        url: '../setting/setting'
                                    });
                                }
                            });
                        } else if (res.cancel) {
                            wx.navigateBack({
                                url: '../setting/setting'
                            });
                        }
                    },
                    fail: function (e) {
                        console.log('fail', e);
                    },
                    complete: function (e) {
                        if (!e.confirm && !e.cancel) {
                            console.log('complete', e);
                            wx.navigateBack({
                                url: '../setting/setting'
                            });
                        }
                    }
                });
            };
        }
    },

    setCamera: function (e) {
        cc.publisher.setSwitchCamera();
    },
    setSound: function (e) {
        if (this.data.soundSwitch) {
            cc.publisher.setMuted(this.data.soundSwitch);//静音
            this.setData({
                soundSwitch: false
            });
        } else {
            cc.publisher.setMuted(this.data.soundSwitch);//非静音  
            this.setData({
                soundSwitch: true
            });
        }
    },
    setBeauty: function (e) {
        if (this.data.beautySwitch) {
            cc.publisher.setBeauty(8);
            cc.publisher.setWhiteness(8);
            this.setData({
                beautySwitch: false
            });
        } else {
            cc.publisher.setBeauty(0);
            cc.publisher.setWhiteness(0);
            this.setData({
                beautySwitch: true
            });
        }
    },
    close: function (e) {

        var self = this;

        wx.showModal({
            title: '提示',
            content: '你确认结束直播吗？',
            success: function (res) {
                if (res.confirm) {

                    wx.navigateBack({
                        url: '../setting/setting'
                    });

                } else if (res.cancel) {
                    return false;
                }
            }
        });

    },

    onUnload: function () {
        cc.publisher.liveStop({
            success: function (res) {
                console.log('停止直播成功回调', res);
            },
            fail: function (res) {
                console.log('停止直播失败回调', res);
            }
        });
    }

});