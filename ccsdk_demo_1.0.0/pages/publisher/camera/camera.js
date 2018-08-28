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

    //前置摄像头
    preposition: function () {

        // if (this.data.camera.position === 'post') {

            this.setData({
                camera: {radio: ['allow', 'ban'], position: 'pre'}
            });

            var json = JSON.stringify(this.data);

            wx.redirectTo({
                url: '../setting/setting?data=' + json
            });

        // }

    },

    //后置摄像头
    postposition: function () {

        // if (this.data.camera.position === 'pre') {

            this.setData({
                camera: {radio: ['ban', 'allow'], position: 'post'}
            });

            var json = JSON.stringify(this.data);

            wx.redirectTo({
                url: '../setting/setting?data=' + json
            });

        // }

    }

});