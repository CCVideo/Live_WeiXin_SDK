var cc = getApp().globalData.ccsdk;

Page({

    //页面的初始数据
    data: {
        password: '',
        userId: '',
        roomId: '',
        userName: '',
        password: '',
        playerUrl: '',
        minCache: 1,
        maxCache: 3,
        autoplay: true,
        muted: false,
        orientation: 'vertical',
        objectFit: 'contain',
        msg: '',
        touserId: '',
        touserName: '',
        route: 0,
        mode: 'video',
        pageUrl: ''
    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {

        console.log(cc.live);

        var self = this;

        this.ctx = cc.live.configLivePlayer(this, wx);

        //响应事件API 

        // 直播开始
        cc.live.on('publish_stream', function (data) {
            console.log('publish_stream', data);
        });
        // 直播结束
        cc.live.on('end_stream', function (data) {
            console.log('end_stream', data);
        });
        //是否开始直播
        cc.live.on('isPublishing', function (data) {
            console.log('isPublishing', data);
        });
        //获得讲师列表
        cc.live.on('room_teachers', function (data) {
            console.log('room_teachers', data);
            var data = JSON.parse(data);
            self.setData({
                touserId: data.teachers[0].id,
                touserName: data.teachers[0].name
            });
        });
        //显示在线人数
        cc.live.on('room_user_count', function (data) {
            console.log('room_user_count', data);
        });
        //接收公聊
        cc.live.on('chat_message', function (data) {
            console.log('chat_message', data);
        });
        //接收私聊
        cc.live.on('private_chat', function (data) {
            console.log('private_chat', data);
        });
        //接收我发送的私聊
        cc.live.on('private_chat_self', function (data) {
            console.log('private_chat_self', data);
        });
        //禁言
        cc.live.on('silence_user_chat_message', function (data) {
            console.log('silence_user_chat_message', data);
        });
        //返回答案
        cc.live.on('answer', function (data) {
            console.log('answer', data);
        });
        //收到问题
        cc.live.on('question', function (data) {
            console.log('question', data);
        });
        //发布问题
        cc.live.on('publish_question', function (data) {
            console.log('publish_question', data);
        });
        //文档翻页
        cc.live.on('page_change', function (data) {
            console.log('page_change', data);
            self.setData({
                pageUrl: data.value.url
            });
        });
        //画笔信息
        cc.live.on('draw', function (data) {
            console.log('draw', data);
        });
        //观看者信息
        cc.live.on('viewer_info', function (data) {
            console.log('viewer_info', data);
        });
        //模版信息
        cc.live.on('template_info', function (data) {
            console.log('template_info', data);
        });
        //房间信息（简介）
        cc.live.on('room_info', function (data) {
            console.log('room_info', data);
        });
        //公告
        cc.live.on('announcement', function (data) {
            console.log('announcement', data);
        });
        //公告
        cc.live.on('announcement_info', function (data) {
            console.log('announcement_info', data);
        });
        //历史记录
        cc.live.on('isPublishing_log', function (data) {
            console.log('isPublishing_log', data);
        });
        cc.live.on('page_change_log', function (data) {
            console.log('page_change_log', data);
        });
        cc.live.on('draw_log', function (data) {
            console.log('draw_log', data);
        });
        cc.live.on('question_log', function (data) {
            console.log('question_log', data);
        });
        cc.live.on('answer_log', function (data) {
            console.log('answer_log', data);
        });
        cc.live.on('chat_log', function (data) {
            console.log('chat_log', data);
        });

    },

    //生命周期函数--监听页面初次渲染完成
    onReady: function () {

    },

    //初始化cc对象
    bindInit: function () {
        cc.live.init({
            userId: this.data.userId,
            roomId: this.data.roomId,
            userName: this.data.userName,
            password: this.data.password,
            wx: wx,
            forcibly: false,
            success: function (data) {
                console.log(data);
                // if(data.code === 9002){
                //   wx.redirectTo({
                //     url: '../test/test'
                //   })
                // }
            },
            fail: function (data) {
                console.log(data);
            }
        });
    },

    bindMuted: function () {
        if (this.data.muted) {
            this.setData({
                muted: false
            });
        } else {
            this.setData({
                muted: true
            });
        }
    },

    bindOrientation: function () {
        if (this.data.orientation === 'vertical') {
            this.setData({
                orientation: 'horizontal'
            });
        } else {
            this.setData({
                orientation: 'vertical'
            });
        }
    },

    bindObjectFit: function () {
        if (this.data.objectFit === 'fillCrop') {
            this.setData({
                objectFit: 'contain'
            });
        } else {
            this.setData({
                objectFit: 'fillCrop'
            });
        }
    },

    bindPlay: function () {
        this.ctx.play({
            success: function (res) {
                console.log('play success');
            },
            fail: function (res) {
                console.log(res);
            }
        });
    },

    bindPause: function () {
        this.ctx.pause({
            success: function (res) {
                console.log('pause success');
            },
            fail: function (res) {
                console.log('pause fail');
            }
        });
    },

    bindStop: function () {
        this.ctx.stop({
            success: function (res) {
                console.log('stop success');
            },
            fail: function (res) {
                console.log('stop fail');
            }
        });
    },

    bindResume: function () {
        this.ctx.resume({
            success: function (res) {
                console.log('resume success');
            },
            fail: function (res) {
                console.log('resume fail');
            }
        });
    },

    bindMute: function () {
        this.ctx.mute({
            success: function (res) {
                console.log('mute success');
            },
            fail: function (res) {
                console.log('mute fail');
            }
        });
    },

    bindRequestFullScreen: function () {
        this.ctx.requestFullScreen({
            success: function (res) {
                console.log('requestFullScreen success');
            },
            fail: function (res) {
                console.log('requestFullScreen fail');
            }
        });
    },

    bindRxitFullScreen: function () {
        this.ctx.exitFullScreen({
            success: function (res) {
                console.log('exitFullScreen success');
            },
            fail: function (res) {
                console.log('exitFullScreen fail');
            }
        });
    },

    //切换线路
    bindStreamRoute: function () {
        cc.live.streamRoute(this.data.route);
        this.data.route++;
        if (this.data.route == 3) {
            this.data.route = 0;
        }
    },

    //切换音频视频模式
    bindStreamMode: function () {
        if (this.data.mode === 'video') {
            cc.live.streamMode(this.data.mode);
            this.setData({
                mode: 'audio'
            });
        } else {
            cc.live.streamMode(this.data.mode);
            this.setData({
                mode: 'video'
            });
        }
    },

    input: function (e) {
        this.setData({
            msg: e.detail.value
        });
    },

    //发送公聊
    sendPublicChatMsg: function () {
        cc.live.sendPublicChatMsg(this.data.msg);
        this.setData({
            msg: ''
        });
    },

    //发送私聊
    sendPrivateChatMsg: function () {
        cc.live.sendPrivateChatMsg(this.data.touserId, this.data.touserName, this.data.msg);
        this.setData({
            msg: ''
        });
    },

    //发送问题
    sendQuestionMsg: function () {
        cc.live.sendQuestionMsg(this.data.msg);
        this.setData({
            msg: ''
        });
    },

    statechange: function (e) {
        console.log('statechange', e);
    },

    fullscreenchange: function (e) {
        console.log('fullscreenchange', e);
    },

    netstatus: function (e) {
        console.log('netstatus', e);
    },

    error: function (e) {
        console.log('error', e);
    }

});