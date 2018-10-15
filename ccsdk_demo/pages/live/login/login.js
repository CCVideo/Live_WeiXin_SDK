var cc = getApp().globalData.ccsdk;

Page({

    data: {
        userId: '',//CC账号ID
        roomId: '',//直播间ID
        userName: '',//昵称
        password: '',//密码
        btnType: 'allow',//按钮类型
        errorHintText: '',
        hint: false,//提示
        loading: false,//加载中

        roomTitle: '',//
        desc: '',//简介
        announcement: '',//公告
        pdfView: 0,//文档模块
        chatView: 0,//聊天模块
        qaView: 0,//问答模块
        viewerName: '',//观看者昵称
        viewerId: '',//观看者id
        isLogin: true
    },

    onShow: function () {
        cc.live.quit();
    },

    onLoad: function () {

        var self = this;

        self.setOpts();

        //按钮状态
        self.checkOutBtnType();

        //模版信息
        cc.live.on('template_info', function (data) {
            self.setData({
                pdfView: data.pdfView,
                chatView: data.chatView,
                qaView: data.qaView,
            });
        });

        //观看者信息
        cc.live.on('viewer_info', function (data) {
            self.setData({
                viewerName: data.name,
                viewerId: data.id
            });
        });

        //简介
        cc.live.on('room_info', function (data) {
            self.setData({
                roomTitle: data.name,
                desc: data.desc
            });
        });

        //公告
        cc.live.on('announcement_info', function (data) {
            self.setData({
                announcement: data ? data : '暂无'
            });
        });
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
    setUserName: function (e) {
        this.setData({
            userName: e.detail.value
        });
        this.checkOutBtnType();
    },

    //设置passWord
    setPassword: function (e) {
        this.setData({
            password: e.detail.value
        });
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
        wx.setStorageSync('live_opts',
            {
                userId: this.data.userId,
                roomId: this.data.roomId,
                userName: this.data.userName,
                password: this.data.password
            });
    },

    getStorage: function () {
        return wx.getStorageSync('live_opts');
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

        //参数校验
        if (!self.checkOutParam()) {
            return;
        }

        self.setData({
            loading: true
        });

        self.setStorage();

        //登录
        cc.live.init({
            userId: self.data.userId,
            roomId: self.data.roomId,
            userName: self.data.userName,
            password: self.data.password,
            wx: wx,
            success: function (data) {
                if (!self.data.isLogin) {
                    return false;
                }
                console.log('登录成功回掉', data);

                self.setData({
                    loading: false
                });
                var str = '&roomTitle=' + encodeURIComponent(self.data.roomTitle)
                    + '&desc=' + encodeURIComponent(self.data.desc)
                    + '&announcement=' + encodeURIComponent(self.data.announcement)
                    + '&pdfView=' + encodeURIComponent(self.data.pdfView)
                    + '&chatView=' + encodeURIComponent(self.data.chatView)
                    + '&qaView=' + encodeURIComponent(self.data.qaView)
                    + '&viewerName=' + encodeURIComponent(self.data.viewerName)
                    + '&viewerId=' + encodeURIComponent(self.data.viewerId);

                wx.navigateTo({
                    url: '../player/player?' + str
                });

            },
            fail: function (res) {
                console.log('登录失败回掉', res);
                self.hint(res.message);

                // if (res.code === 412) {
                // } else {
                //     self.hint('直播间信息填写有误，请检查');
                // }
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

        if (!self.data.userId || !self.data.roomId || !self.data.userName) {
            return false;
        }
        return true;
    }

});