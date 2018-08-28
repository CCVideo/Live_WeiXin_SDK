var cc = getApp().globalData.ccsdk;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        camera: {
            radio: ['allow', 'ban'],
            position: 'pre'
        },
        resolution: {
            radio: ['allow', 'ban'],
            resolution: 'SD'
        },
        beauty: false,
        isConnected: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var self = this;
        wx.onNetworkStatusChange(function (res) {
            self.setData({
                isConnected: res.isConnected
            });
        });

        cc.publisher.on('kick_out', function (data) {
            console.log('kick_out', data);
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '主讲已在其他地方登录，点击确定，您将退出推流端',
                success: function () {
                    wx.navigateBack({
                        url: '../login/login'
                    });
                }
            });

        });

        if (JSON.stringify(options) !== '{}') {
            var obj = JSON.parse(options.data);
            this.setData({
                camera: {
                    radio: obj.camera.radio,
                    position: obj.camera.position
                },
                resolution: {
                    radio: obj.resolution.radio,
                    resolution: obj.resolution.resolution
                },
                beauty: obj.beauty
            });
        }

    },

    //设置美颜
    setBeauty: function (e) {

        var self = this;

        var value = e.detail.value;

        if (value) {
            self.setData({
                beauty: true
            });
        } else {
            self.setData({
                beauty: false
            });
        }

    },

    //切换摄像头
    setSwitchCamera: function () {

        var json = JSON.stringify(this.data);

        wx.redirectTo({
            url: '../camera/camera?data=' + json
        });

    },

    //设置清晰度
    setResolution: function () {

        var json = JSON.stringify(this.data);

        wx.redirectTo({
            url: '../resolution/resolution?data=' + json
        });

    },

    //开始直播
    startLive: function () {

        var json = JSON.stringify(this.data);
        if (this.data.isConnected) {
            wx.navigateTo({
                url: '../live/live?data=' + json
            });
        } else {
            console.log('没有网络');
        }

    }

});