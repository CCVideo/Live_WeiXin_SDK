var cc = getApp().globalData.ccsdk;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userId: '',
        roomId: '',
        recordId: '',
        viewername: '',
        viewertoken: '',
        btnType: 'allow',
        hint: false,
        loading: false,
        errorHintText: '直播间信息填写有误，请检查',
        room_info: {},
        template_info: {},
        questions_info: [],
        answers_info: [],
        chat_msg_info: [],
        isLogin:true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var self = this;

        self.setOpts();

        self.checkOutBtnType();

        cc.replay.setDebug(true);

        cc.replay.on('player_load', function (data) {
            // console.log('player_load', data);
        });

        cc.replay.on('room_info', function (data) {
            // console.log('room_info', data);
            self.setData({
                room_info: data
            });
        });

        cc.replay.on('template_info', function (data) {
            // console.log('template_info', data);
            self.setData({
                template_info: data
            });
        });

        cc.replay.on('pages_info', function (data) {
            // console.log('pages_info', data);
        });

        cc.replay.on('questions_info', function (data) {
            // console.log('questions_info', data);
            self.setData({
                questions_info: data
            });
        });

        cc.replay.on('answers_info', function (data) {
            // console.log('answers_info', data);
            self.setData({
                answers_info: data
            });
        });

        cc.replay.on('chat_msg_info', function (data) {
            // console.log('chat_msg_info', data);
            self.setData({
                chat_msg_info: data
            });
        });
    },

    onShow: function () {

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

    //设置recordId
    setRecordId: function (e) {
        this.setData({
            recordId: e.detail.value
        });
        this.checkOutBtnType();
    },

    //设置name
    setName: function (e) {
        this.setData({
            viewername: e.detail.value
        });
        this.checkOutBtnType();
    },

    //设置passWord
    setPassWord: function (e) {
        this.setData({
            viewertoken: e.detail.value
        });
        this.checkOutBtnType();
    },

    //扫码
    scancode: function () {

        var self = this;
        wx.scanCode({
            success: function (res) {
                var data = parseUrl(res.result);
                if (data['roomid'] && data['userid'] && data['recordid']) {
                    self.setData({
                        roomId: data['roomid'],
                        userId: data['userid'],
                        recordId: data['recordid']
                    });
                } else {
                    self.hint('无效二维码');
                }
                self.checkOutBtnType();
            }
        });

        function parseUrl(url) {
            var querys = url.split('?');
            if(!querys[1]){
                self.hint('无效二维码');
                return false;
            }
            var query = url.split('?')[1];
            var queryArr = query.split('&');
            if(queryArr.length === 0){
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
        wx.setStorageSync('replay_opts',
            {
                userId: this.data.userId,
                roomId: this.data.roomId,
                recordId: this.data.recordId,
                viewername: this.data.viewername,
                viewertoken: this.data.viewertoken
            });
    },

    getStorage: function () {
        return wx.getStorageSync('replay_opts');
    },

    setOpts: function () {
        this.setData({
            userId: this.getStorage().userId || '',
            roomId: this.getStorage().roomId || '',
            recordId: this.getStorage().recordId || '',
            viewername: this.getStorage().viewername || '',
            viewertoken: this.getStorage().viewertoken || '',
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
        cc.replay.init({
            userId: this.data.userId,
            roomId: this.data.roomId,
            recordId: this.data.recordId,
            viewername: this.data.viewername,
            viewertoken: this.data.viewertoken,
            wx: wx,
            success: function (res) {
                if(!self.data.isLogin){
                    return false;
                }
                console.log('登录成功回掉', res);
                self.setData({
                    loading: false
                });

                var room_info = encodeURIComponent(JSON.stringify(self.data.room_info));
                var template_info = encodeURIComponent(JSON.stringify(self.data.template_info));
                var questions_info = encodeURIComponent(JSON.stringify(self.data.questions_info));
                var answers_info = encodeURIComponent(JSON.stringify(self.data.answers_info));
                var chat_msg_info = encodeURIComponent(JSON.stringify(self.data.chat_msg_info));
                var json = 'room_info=' + room_info + '&template_info=' + template_info + '&questions_info=' + questions_info + '&answers_info=' + answers_info + '&chat_msg_info=' + chat_msg_info;
                wx.navigateTo({
                    url: '../replay/replay?' + json
                });
            },
            fail: function (res) {
                console.log('登录失败回掉', res);
                self.hint(res.message);
            }
        });

    },

    onUnload:function(){
        this.setData({
            isLogin:false
        })
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

        if (!self.data.userId || !self.data.roomId || !self.data.recordId || !self.data.viewername) {
            return false;
        }
        return true;

    }

});