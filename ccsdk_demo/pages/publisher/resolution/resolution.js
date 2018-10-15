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
        beauty: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        if (JSON.stringify(options) !== '{}') {
            var obj = JSON.parse(options.data);
            this.setData({
                camera: {radio: obj.camera.radio, position: obj.camera.position},
                resolution: {radio: obj.resolution.radio, resolution: obj.resolution.resolution},
                beauty: obj.beauty
            });
        }

    },

    //流畅
    setSD: function () {

        // if (this.data.resolution.resolution === 'HD') {

        this.setData({
            resolution: {radio: ['allow', 'ban'], resolution: 'SD'}
        });

        var json = JSON.stringify(this.data);

        wx.redirectTo({
            url: '../setting/setting?data=' + json
        });

        // }

    },

    //清晰
    setHD: function () {

        // if (this.data.resolution.resolution === 'SD') {

        this.setData({
            resolution: {radio: ['ban', 'allow'], resolution: 'HD'}
        });

        var json = JSON.stringify(this.data);

        wx.redirectTo({
            url: '../setting/setting?data=' + json
        });

        // }

    }

});