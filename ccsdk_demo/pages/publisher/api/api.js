var cc = getApp().globalData.ccsdk;

Page({
    data: {
        //测试账号
        userId: '',
        roomId: '',
        name: '',
        passWord: '',
        msg: '',
        list: [],
        touserid: '',
        tousername: ''
    },
    onLoad: function () {

        cc.live.setDebug(true);

        var that = this;
        //响应事件API 显示在线人数
        cc.publisher.on('room_user_count', function (data) {
            console.log('room_user_count', data);
        });
        //在线列表
        cc.publisher.on('room_context', function (data) {
            console.log('room_context', data);
            that.setData({
                list: JSON.parse(data)
            });
        });
        //接收公聊
        cc.publisher.on('chat_message', function (data) {
            console.log('chat_message', data);
        });
        //接收私聊
        cc.publisher.on('private_chat', function (data) {
            console.log('private_chat', data);
        });
        //接收我发送的私聊
        cc.publisher.on('private_chat_self', function (data) {
            console.log('private_chat_self', data);
        });
        //主播信息
        cc.publisher.on('user_info', function (data) {
            console.log('user_info', data);
        });

    },
    //登录
    login: function () {
        var self = this;
        cc.publisher.init({
            userId: self.data.userId,
            roomId: self.data.roomId,
            userName: self.data.name,
            password: self.data.passWord,
            wx: wx,
            success: function (res) {
                getApp().globalData.name = self.data.name;
                console.log('登录成功回掉', res);
            },
            fail: function (res) {
                console.log('登录失败回掉', res);
            }
        });
    },
    //开始直播
    liveStart: function () {
        cc.publisher.liveStart({
            success: function (res) {
                console.log('开始直播成功回掉', res);
            },
            fail: function (res) {
                console.log('开始直播失败回掉', res);
            }
        });
    },
    //停止直播
    liveStop: function () {
        cc.publisher.liveStop({
            success: function (res) {
                console.log('停止直播成功回掉', res);
            },
            fail: function (res) {
                console.log('停止直播失败回掉', res);
            }
        });
    },
    input: function (e) {
        var that = this;
        that.setData({
            msg: e.detail.value
        });
    },
    //发送公聊
    sendPublicChatMsg: function () {
        var that = this;
        cc.publisher.sendPublicChatMsg(that.data.msg);
        that.setData({
            msg: ''
        });
    },
    //发送私聊
    sendPrivateChatMsg: function () {
        var that = this;
        if (!that.data.list.onlineUsers) {
            return;
        }
        //目前私聊发给第一个学生
        that.data.list.onlineUsers.forEach(function (arr) {
            if (arr.role === 'student') {
                that.data.touserid = arr.id;
                that.data.tousername = arr.name;
                return true;
            }
        });
        cc.publisher.sendPrivateChatMsg(that.data.touserid, that.data.tousername, that.data.msg);
        that.setData({
            msg: ''
        });
    },
    //摄像头切换
    setSwitchCamera: function () {
        cc.publisher.setSwitchCamera();
    },
    //宽高比
    setAspect: function () {
        var that = this;
        if (that.aspectSwitch) {//点击按钮，切换开关
            cc.publisher.setAspect('3:4');
            that.aspectSwitch = false;
        } else {
            cc.publisher.setAspect('9:16');
            that.aspectSwitch = true;
        }
    },
    //分辨率
    setResolution: function () {
        var that = this;
        if (that.resolutionSwitch) {
            cc.publisher.setResolution('SD');
            that.resolutionSwitch = false;
        } else {
            cc.publisher.setResolution('HD');
            that.resolutionSwitch = true;
        }
    },
    //横竖屏
    setOrientation: function () {
        var that = this;
        if (that.orientationSwitch) {
            cc.publisher.setOrientation('vertical');
            that.orientationSwitch = false;
        } else {
            cc.publisher.setOrientation('horizontal');
            that.orientationSwitch = true;
        }
    },
    //静音
    setMuted: function () {
        var that = this;
        if (that.mutedSwitch) {
            cc.publisher.setMuted(false);
            that.mutedSwitch = false;
        } else {
            cc.publisher.setMuted(true);
            that.mutedSwitch = true;
        }
    },
    //美颜
    setBeauty: function (e) {
        //value = 0-10
        cc.publisher.setBeauty(e.detail.value);
    },
    //美白
    setWhiteness: function (e) {
        cc.publisher.setWhiteness(e.detail.value);
    },
    //状态变化事件
    statechange: function (e) {
        console.log('状态变化事件', e);
    },
    //网络状态通知
    netstatus: function (e) {
        console.log('网络状态通知', e);
    },
    //渲染错误事件
    error: function (e) {
        console.log('渲染错误事件', e);
    },
    onReady: function () {

    }
});
