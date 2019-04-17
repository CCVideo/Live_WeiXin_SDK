var cc = getApp().globalData.ccsdk;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userId: '',
        roomId: '',
        userName: '',
        password: '',
        btnType: 'allow',
        hint: false,
        loading: false,
        errorHintText: '直播间信息填写有误，请检查',
        isLogin: true,

        userInfo: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setOpts();
        this.checkOutBtnType();

        var self = this;
        //主播信息
        cc.publisher.on('user_info', function (data) {
            console.log(data);
        });
    },

    onShow: function () {
        //退出登陆
        cc.publisher.quit();
    },

    //设置userId
    setUserId: function (e) {
        this.setData({
            userId: e.detail.value
        });
        this.checkOutBtnType();
    },

    //设置roomId
    setRoomId: function (e) {
        this.setData({
            roomId: e.detail.value
        });
        this.checkOutBtnType();
    },

    //设置name
    setName: function (e) {
        this.setData({
            userName: e.detail.value
        });
        this.checkOutBtnType();
    },

    //设置passWord
    setPassWord: function (e) {
        this.setData({
            password: e.detail.value
        });
        this.checkOutBtnType();
    },

    //扫码
    scancode: function () {
        var self = this;

        wx.scanCode({
            success: function (res) {
                var data = parseUrl(res.result);
                if (data['roomid'] && data['userid']) {
                    self.setData({
                        roomId: data['roomid'],
                        userId: data['userid']
                    });
                } else {
                    self.hint('无效二维码');
                }
                self.checkOutBtnType();
            }
        });

        function parseUrl(url) {
            var querys = url.split('?');
            if (!querys[1]) {
                self.hint('无效二维码');
                return false;
            }
            var query = url.split('?')[1];
            var queryArr = query.split('&');
            if (queryArr.length === 0) {
                self.hint('无效二维码');
                return false;
            }
            var obj = {};
            queryArr.forEach(function (item) {
                var key = item.split('=')[0];
                var value = item.split('=')[1];
                obj[key] = value;
            });
            return obj;
        }
    },

    setStorage: function () {
        var self = this;
        wx.setStorageSync('publisher_opts',
            {
                userId: self.data.userId,
                roomId: self.data.roomId,
                userName: self.data.userName,
                password: self.data.password
            });
    },

    getStorage: function () {
        return wx.getStorageSync('publisher_opts');
    },

    setOpts: function () {
        this.setData({
            userId: this.getStorage().userId || '',
            roomId: this.getStorage().roomId || '',
            userName: this.getStorage().userName || '',
            password: this.getStorage().password || ''
        });
        this.checkOutBtnType();
    },

    //登录
    login: function () {

        var self = this;

        if (!self.checkOutParam()) {
            return;
        }

        self.setData({
            loading: true
        });

        self.setStorage();

        //登录
        cc.publisher.init({
            userId: self.data.userId,
            roomId: self.data.roomId,
            userName: self.data.userName,
            password: self.data.password,
            wx: wx,
            success: function (res) {
                if (!self.data.isLogin) {
                    return false;
                }
                console.log('登录成功回调', res);

                getApp().globalData.name = self.data.userName;

                self.setData({
                    loading: false
                });
                wx.navigateTo({
                    url: '../setting/setting'
                });

            },
            fail: function (res) {
                console.log('登录失败回调', res);
                self.hint(res.message);
            }
        });

    },

    onUnload: function () {
        this.setData({
            isLogin: false
        });
    },

    hint: function (info) {
        var self = this;

        self.setData({
            errorHintText: info,
            loading: false,
            hint: true
        });

        setTimeout(function () {
            self.setData({
                hint: false
            });
        }, 2500);
    },

    checkOutBtnType: function () {

        var self = this;

        if (self.checkOutParam()) {
            self.setData({
                btnType: 'allow'
            });
        } else {
            self.setData({
                btnType: 'ban'
            });
        }

    },

    //校验参数
    checkOutParam: function () {

        var self = this;

        if (!self.data.userId || !self.data.roomId || !self.data.userName || !self.data.password) {
            return false;
        }
        return true;

    }

});