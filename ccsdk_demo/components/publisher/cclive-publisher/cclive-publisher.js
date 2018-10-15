var cc = getApp().globalData.ccsdk;

Component({
    //组件的属性列表
    properties: {
        muted: {
            type: Boolean,
            value: false
        },
        orientation: {
            type: String,
            value: 'vertical'
        },
        beauty: {
            type: Number,
            value: 0
        },
        whiteness: {
            type: Number,
            value: 0
        },
        aspect: {
            type: String,
            value: '9:16'
        },
        waitingImage: {
            type: String,
            value: ''
        },
        ccwidth: {
            type: String,
            value: '100%'
        },
        ccheight: {
            type: String,
            value: '100%'
        },
        ccpostion: {
            type: String,
            value: 'absolute'
        },
        header: {
            type: String,
            value: 'visible'
        },
        chat: {
            type: String,
            value: 'visible'
        },
        control: {
            type: String,
            value: 'visible'
        }

    },

    //组件内部的方法列表、外部事件列表
    methods: {
        statechange: function (e) {
            var myEventDetail = e.detail; // detail对象，提供给事件监听函数
            var myEventOption = {}; // 触发事件的选项(控制冒泡捕获等)
            this.triggerEvent('statechange', myEventDetail, myEventOption);
        },
        netstatus: function (e) {
            var myEventDetail = e.detail;
            var myEventOption = {};
            this.triggerEvent('netstatus', myEventDetail, myEventOption);
        },
        error: function (e) {
            var myEventDetail = e.detail;
            var myEventOption = {};
            this.triggerEvent('error', myEventDetail, myEventOption);
        },
        setCamera: function () {
            var myEventDetail = {
                type: 'camera'
            };
            var myEventOption = {};
            this.triggerEvent('SetCamera', myEventDetail, myEventOption);
        },
        setSound: function () {
            var myEventDetail = {
                type: 'sound'
            };
            var myEventOption = {};
            this.triggerEvent('SetSound', myEventDetail, myEventOption);
        },
        setBeauty: function () {
            var myEventDetail = {
                type: 'beauty'
            };
            var myEventOption = {};
            this.triggerEvent('SetBeauty', myEventDetail, myEventOption);
        },
        close: function () {
            var myEventDetail = {
                type: 'close'
            };
            var myEventOption = {};
            this.triggerEvent('Close', myEventDetail, myEventOption);
        },
    },
    //组件的初始数据
    data: {
        cameraBoolean: true, //摄像头默认关闭
        publisherUrl: '', //推流地址
        aspect: '3:4',
        mode: 'SD',
        orientation: 'vertical',
        muted: false, //muted属性不存在，则有声音
        beauty: 0,
        whiteness: 0,
        minBitrate: 200,
        maxBitrate: 1000,
        name: 'name',
        number: 0,
        chatData: [],
        scrollHeight: 0,
        chatLengthMax: -150,
        netConnectState: {
            state: true,
            info: '网络已链接',
            time: 1000,
            toggle: false
        }
    },

    ready: function () {
        var self = this;

        //配置live-publisher
        self.ctx = cc.publisher.configLivePublisher(self, wx);

        //网络链接监听
        var netConnectStateTimer = {};
        cc.publisher.on('network_change', function (data) {
            clearTimeout(netConnectStateTimer);

            if (data.state) {
                self.setData({
                    netConnectState: {
                        state: true,
                        info: '网络链接正常',
                        time: 4000,
                        toggle: true
                    }
                });
            } else {
                self.setData({
                    netConnectState: {
                        state: false,
                        info: '网络未链接',
                        time: 1200,
                        toggle: true
                    }
                });
            }

            var netConnectStateTimerCallback = function () {
                self.setData({
                    netConnectState: {
                        state: self.data.netConnectState.state,
                        info: self.data.netConnectState.info,
                        time: self.data.netConnectState.time,
                        toggle: false
                    }
                });
            };
            netConnectStateTimer = setTimeout(netConnectStateTimerCallback, self.data.netConnectState.time);
        });

        //在线列表
        cc.publisher.on('room_context', function (data) {
            var data = JSON.parse(data);
            data.onlineUsers.forEach(function (arr) {
                if (arr.role === 'publisher') {
                    self.setData({
                        name: imposeNameLength(arr.name)
                    });
                    return true;
                }
            });
        });

        var name = getApp().globalData.name || '欢迎使用cc视频';

        function imposeNameLength(str) {
            var n = str.length < 10 ? str : str.substr(0, 9) + '...';
            return n;
        }

        self.setData({
            name: imposeNameLength(name)
        });

        //在线人数
        cc.publisher.on('room_user_count', function (data) {
            self.setData({
                number: imposeNameLength(data.toString())
            });
        });

        var chatMsg = [];
        //收到公聊
        cc.publisher.on('chat_message', function (data) {
            formateChatData(data);
        });

        //收到私聊
        cc.publisher.on('private_chat', function (data) {
            formateChatData(data);
        });

        function formateChatData(data) {
            var data = JSON.parse(data);
            chatMsg.push(data);
            self.setData({
                chatData: chatMsg.slice(self.data.chatLengthMax)
            });
            console.log(self.data.chatData);
            console.log(chatMsg);
            scrollChatList();
        }

        function scrollChatList() {
            getScrollHeight(function (height) {
                self.setData({
                    scrollHeight: height
                });
            });
        }

        function getScrollHeight(fn) {
            var scrollHeight = 0;
            var query = wx.createSelectorQuery().in(self);
            query.selectAll('.chat-cell').boundingClientRect(function (res) {
                for (var i = 0; i < res.length; i++) {
                    scrollHeight += res[i].height;
                }
                fn(scrollHeight);
            }).exec();
        }

        //订阅摄像头切换
        cc.publisher.on('switchCamera', function () {

            //调用wx.switchCamera摄像头切换方法
            self.ctx.switchCamera({
                success: function (res) {
                    console.log('switchCamera success', res);
                },
                fail: function (res) {
                    console.log('switchCamera fail', res);
                }
            });

        });

        //宽高比
        cc.publisher.on('aspect', function (aspect) {

            //改变live-pusher属性的值，控制宽高比
            self.setData({
                aspect: aspect
            });

        });

        //分辨率
        cc.publisher.on('resolution', function (mode) {

            self.setData({
                mode: mode
            });

        });
        //横竖屏
        cc.publisher.on('orientation', function (orientation) {

            self.setData({
                orientation: orientation
            });

        });
        //静音
        cc.publisher.on('muted', function (muted) {

            self.setData({
                muted: muted
            });

        });
        //美颜
        cc.publisher.on('beauty', function (beauty) {

            self.setData({
                beauty: beauty
            });

        });
        //美白
        cc.publisher.on('whiteness', function (whiteness) {

            self.setData({
                whiteness: whiteness
            });

        });
        //码率
        cc.publisher.on('bitrate', function (bitrate) {

            self.setData({
                minBitrate: bitrate[0],
                maxBitrate: bitrate[1]
            });

        });

    }

});