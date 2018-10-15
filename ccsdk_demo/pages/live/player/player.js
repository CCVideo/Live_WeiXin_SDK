//TODO 私聊
var cc = getApp().globalData.ccsdk;

Page({
    data: {
        //实现双击，退出全屏
        touchStartTime: 0,
        touchEndTime: 0,
        lastTapTime: 0,
        lastTapTimeoutFunc: null,
        //直播模式：视频模式、文档模式 videoModel documentModel
        model: 'videoModel',
        minCache: 0,
        maxCache: 1,
        dbView: true,
        dbWidth: '100%',
        dbHeight: '423rpx',
        playerUrl: '', //观看地址
        viewerName: '', //name
        viewerId: '', //id
        pageData: {},
        pageUrl: '', //文档地址
        peoples: 0, //在线人数    
        chatLog: [], //历史聊天信息
        roomTitle: '', //直播间标题
        desc: '', //简介
        toggleNotice: false, //切换显示隐藏公告    
        announcement: '暂无', //公告
        isPublishing: 0, //是否开始直播
        isBan: 0,//是否禁播
        toggleCover: [false, false],
        hintLiveNot: true, //直播未开始
        hintLiveNotText: '直播未开始',
        btnGroup: false, //按钮组    
        toggleControls: true, //直播文档控制器
        living: false, //直播中      
        pdfView: 0, //文档模块
        chatView: 0, //聊天模块
        qaView: 0, //问答模块
        switchPip: ['', '', ''], //视频文档切换
        playerView: 0, //视频模块
        toggleExitFullScreenBtn: false,
        //按钮图标切换
        btnSwitchoverFullScreen: 'switchover', //switchover fullscreen    
        btnTogglePlayerLiveMode: 'hidden-video', //video-live only-audio hidden-video show-video
        toggleSwitchover: true, //切换开关
        togglePlayer: true, //切换显示隐藏视频开关
        toggleSelectRoute: false, //选择线路    
        options: ['主线路', '备用线路', '备用线路'], //线路
        RouteOptionActive: 0, //线路选中样式
        orientation: 'vertical', //屏幕方向
        objectFit: 'contain', //直播填充方式
        mode: 'video', //默认视频模式
        audioMode: false, //音频模式  
        tabOptionSelected: 0, //swpier选项
        tabContent: ['聊天', '问答', '简介'],
        //格式 { name: 'name', msg: 'msg', type: 0 }
        message: [], //聊天信息
        chatLength: 0,
        toChat: '',
        toggleChatScroll: true,
        chatMsg: '', //发送的聊天信息
        toggleCheckoutInputHint: false,
        //提示内容 输入信息 不能为空
        checkoutInputHint: '',
        answerLog: '', //问历史记录
        questionLog: '', //答历史记录
        //格式 { name: 'name', time: '00:00', question: 'question', type: 0,encryptId:'encryptId', display:false ,answers: [{ name: 'name', answer: 'answer',isPrivate:0 }]}
        questions: [], //问答信息
        toQuestionAnswer: '',
        questionAnswerLength: 0,
        toggleQuestionAnswerScroll: true,
        question: '',
        //eye eye-hidden
        eye: 'eye',
        toggleHintShowQuestion: false,
        //显示所有问答 只看我的问答
        hintShowQuestion: '只看我的问答',
        toggleShowQuestion: true,
        topChatInputHeight: 0,
        topQuestionInputHeight: 0,
        //emoji emoji-select
        emoji: 'emoji',
        toggleEmoji: false,
        emojiRow: [0, 1, 2],
        emojiCol: [
            [1, 2, 3, 4, 5, 6, 7],
            [8, 9, 10, 11, 12, 13, 14],
            [15, 16, 17, 18, 19, 20, 21]
        ],
        toggleLiveControlsTimer: {},
        chatLengthMax: -150,
        fullDocument: '',//文档全屏
        pageHeight: 0,
        pageWidth: 0,
        windowHeight: 0,
        windowWidth: 0,
        toggleDocument: false,
        documentTop: 0,
        documentHeight: '',
        toggleDocumentFullScreen: false,
        netConnectState: {
            state: true,
            info: '网络已链接',
            time: 1000,
            toggle: false
        },
        netConnectStateTimer: {}
    },

    alignCenter: function () {
        var height = this.data.windowWidth * this.data.pageHeight / this.data.pageWidth;
        var top = (this.data.windowHeight / 2) - (height / 2);
        this.setData({
            documentHeight: height.toFixed(2) + 'px',
            documentTop: 0
        });
        if (height >= this.data.windowHeight) {
            return;
        }
        this.setData({
            documentTop: top + 'px'
        });
    },

    alignTop: function () {
        this.setData({
            documentTop: 0
        });
    },

    docuemntFullScreen: function () {
        if (this.data.fullDocument) {
            return;
        }
        this.setData({
            fullDocument: 'fullDocument',
            toggleCover: [false, false]
        });
        if (this.data.btnTogglePlayerLiveMode === 'hidden-video') {
            this.setData({
                playerView: 0
            });
        }
        this.alignCenter();
    },

    docuemntExitFullScreen: function () {
        if (!this.data.fullDocument) {
            return;
        }
        this.setData({
            fullDocument: '',
            toggleCover: [true, false]
        });
        if (this.data.btnTogglePlayerLiveMode === 'hidden-video') {
            this.setData({
                playerView: 1
            });
        }
        this.alignTop();
    },

    bindDocuemntFullScreen: function (e) {
        if (this.data.switchPip[0] !== '') {
            return;
        }
        if (this.data.fullDocument) {
            this.docuemntExitFullScreen();
        } else {
            this.docuemntFullScreen();
        }
    },

    configSwiper: function () {
        var self = this;
        //初始化swiper
        var tabConetent = [];
        if (self.data.chatView) {
            tabConetent.push('聊天');
        }
        if (self.data.qaView) {
            tabConetent.push('问答');
        }
        tabConetent.push('简介');
        //初始化tab
        self.setData({
            tabContent: tabConetent
        });
    },

    configQA: function () {
        var self = this;

        //初始化问答信息
        self.setData({
            questions: formatQuestionAnswerMessage(self.data.questionLog, self.data.answerLog),
            questionAnswerLength: self.data.questionLog.length,
            toQuestionAnswer: 'lastQuestionAnswer'
        });

        function formatQuestionAnswerMessage(question, answer) {
            var arr = [];
            for (var i = 0; i < question.length; i++) {
                var qObj = {};
                qObj.name = question[i].questionUserName;
                qObj.time = question[i].triggerTime.split(' ')[1];
                qObj.question = question[i].content;
                if (question[i].questionUserId == self.data.viewerId) {
                    qObj.type = 1;
                } else {
                    qObj.type = 0;
                }
                qObj.encryptId = question[i].encryptId;
                qObj.answers = [];
                for (var j = 0; j < answer.length; j++) {
                    if (question[i].encryptId == answer[j].encryptId) {
                        var aObj = {};
                        aObj.name = answer[j].answerUserName;
                        aObj.answer = answer[j].content;
                        aObj.isPrivate = answer[j].isPrivate;
                        if (aObj.isPrivate === 0) {
                            qObj.display = true;
                        }
                        qObj.answers.push(aObj);
                    }
                }
                arr.push(qObj);
            }
            return arr;
        }
    },

    configChat: function () {
        var self = this;

        // 初始化聊天信息
        self.setData({
            message: formatChatMessage(self.data.chatLog),
            chatLength: self.data.chatLog.length,
            toChat: 'lastChat'
        });

        function formatChatMessage(chatMsg) {
            chatMsg.sort(function (p1, p2) {
                return parseInt(p1.time) - parseInt(p2.time);
            });
            var arr = [];
            for (var i = 0; i < chatMsg.length; i++) {
                var obj = {};
                obj.name = chatMsg[i].userName;
                obj.msg = cc.live.showEm(chatMsg[i].content);
                if (chatMsg[i].userId == self.data.viewerId) {
                    obj.type = 1;
                } else {
                    obj.type = 0;
                }
                arr.push(obj);
            }
            return arr.slice(self.data.chatLengthMax);
        }
    },

    test: function () {
        // this.configLive();

        this.setData({
            hintLiveNot: false,
            btnGroup: true,
            toggleControls: false,
            living: true,
            playerView: 1,
            btnTogglePlayerLiveMode: 'hidden-video',
            toggleDocumentFullScreen: true,
            isPublishing: 1
        });
    },

    configLive: function () {
        var self = this;

        //是否开始直播
        if (self.data.isPublishing) {
            self.setData({
                hintLiveNot: false,
                btnGroup: true,
                toggleControls: false,
                living: true,
                playerView: 1,
                btnTogglePlayerLiveMode: 'hidden-video',
                toggleDocumentFullScreen: true
            });
        }
    },

    configLiveMode: function () {
        var self = this;

        //配置直播模式
        if (self.data.pdfView) {
            //文档模式
            self.setData({
                toggleCover: [true, false],
                model: 'documentModel'
            });
        } else {
            //视频模式
            self.setData({
                switchPip: ['switch-pip-document', 'switch-pip-image', 'switch-pip-player'],
                toggleCover: [false, true],
                playerView: 1,
                btnSwitchoverFullScreen: 'full-screen',
                btnTogglePlayerLiveMode: 'video-live',
                model: 'videoModel'
            });
        }
    },

    configLiveIsBan: function () {
        var self = this;

        //初始化禁播
        if (self.data.isBan) {
            if (self.data.model === 'documentModel') {
                self.setData({
                    dbView: false
                });
                self.setData({
                    hintLiveNot: true,
                    btnGroup: false,
                    toggleControls: true,
                    living: false,
                    hintLiveNotText: '直播已封禁，请联系管理员',
                    playerView: 0,
                    switchPip: ['', '', ''],
                    toggleCover: [true, false],
                    btnTogglePlayerLiveMode: 'hidden-video',
                    toggleSwitchover: true,
                    togglePlayer: false,
                    dbWidth: '100%',
                    dbHeight: '423rpx',
                    dbView: true,
                    toggleDocumentFullScreen: false
                });
            } else { //视频模式结束直播
                //退出全屏
                self.ctx.exitFullScreen({
                    success: function (res) {
                        console.log('exitFullScreen success');
                    },
                    fail: function (res) {
                        console.log('exitFullScreen fail');
                    }
                });
                self.ctx.stop({
                    success: function (res) {
                        console.log('stop success');
                    },
                    fail: function (res) {
                        console.log('stop fail');
                    }
                });
                //设置结束直播参数
                self.setData({
                    toggleExitFullScreenBtn: false,
                    hintLiveNot: true,
                    btnGroup: false,
                    toggleControls: true,
                    living: false,
                    hintLiveNotText: '直播已封禁，请联系管理员'
                });
            }
        }
    },

    banStream: function () {
        var self = this;

        self.setData({
            isBan: 1
        });
        if (self.data.model === 'documentModel') {
            self.setData({
                dbView: false
            });
            self.setData({
                hintLiveNot: true,
                btnGroup: false,
                toggleControls: true,
                living: false,
                hintLiveNotText: '直播已封禁，请联系管理员',
                playerView: 0,
                switchPip: ['', '', ''],
                toggleCover: [true, false],
                btnTogglePlayerLiveMode: 'hidden-video',
                toggleSwitchover: true,
                togglePlayer: false,
                dbWidth: '100%',
                dbHeight: '423rpx',
                dbView: true,
                toggleDocumentFullScreen: false
            });
        } else { //视频模式结束直播
            //退出全屏
            self.ctx.exitFullScreen({
                success: function (res) {
                    console.log('exitFullScreen success');
                },
                fail: function (res) {
                    console.log('exitFullScreen fail');
                }
            });
            self.ctx.stop({
                success: function (res) {
                    console.log('stop success');
                },
                fail: function (res) {
                    console.log('stop fail');
                }
            });
            //设置结束直播参数
            self.setData({
                toggleExitFullScreenBtn: false,
                hintLiveNot: true,
                btnGroup: false,
                toggleControls: true,
                living: false,
                // isPublishing: 0,
                hintLiveNotText: '直播已封禁，请联系管理员'
            });
        }
    },

    unbanStream: function () {
        var self = this;

        self.setData({
            isBan: 0
        });
        if (!self.data.isPublishing) {
            return;
        }
        if (self.data.model === 'documentModel') {
            self.setData({
                hintLiveNot: false,
                btnGroup: true,
                toggleControls: false,
                living: true,
                playerView: 1,
                toggleDocumentFullScreen: true
            });
        } else { //视频模式开始直播
            //视频模式
            self.setData({
                toggleControls: false,
                hintLiveNot: false,
                btnGroup: true,
                living: true,
                // isPublishing: 1
            });
            self.ctx.play({
                success: function (res) {
                    console.log('play success', res);
                },
                fail: function (res) {
                    console.log('play fail', res);
                }
            });
        }
    },

    publishStream: function () {
        var self = this;

        if (self.data.isBan) {
            return false;
        }
        if (self.data.model === 'documentModel') {
            self.setData({
                hintLiveNot: false,
                btnGroup: true,
                toggleControls: false,
                living: true,
                isPublishing: 1,
                playerView: 1,
                toggleDocumentFullScreen: true,
            });
        } else { //视频模式开始直播
            //视频模式
            self.setData({
                toggleControls: false,
                hintLiveNot: false,
                btnGroup: true,
                living: true,
                isPublishing: 1
            });
            self.ctx.play({
                success: function (res) {
                    console.log('play success', res);
                },
                fail: function (res) {
                    console.log('play fail', res);
                }
            });
        }
    },

    endStream: function () {
        var self = this;

        if (self.data.model === 'documentModel') {
            self.setData({
                dbView: false
            });
            self.setData({
                hintLiveNot: true,
                btnGroup: false,
                toggleControls: true,
                living: false,
                isPublishing: 0,
                hintLiveNotText: '直播结束',
                playerView: 0,
                switchPip: ['', '', ''],
                toggleCover: [true, false],
                btnTogglePlayerLiveMode: 'hidden-video',
                toggleSwitchover: true,
                togglePlayer: false,
                dbWidth: '100%',
                dbHeight: '423rpx',
                dbView: true,
                toggleDocumentFullScreen: false
            });
        } else { //视频模式结束直播
            //退出全屏
            self.ctx.exitFullScreen({
                success: function (res) {
                    console.log('exitFullScreen success');
                },
                fail: function (res) {
                    console.log('exitFullScreen fail');
                }
            });
            self.ctx.stop({
                success: function (res) {
                    console.log('stop success');
                },
                fail: function (res) {
                    console.log('stop fail');
                }
            });
            //设置结束直播参数
            self.setData({
                toggleExitFullScreenBtn: false,
                hintLiveNot: true,
                btnGroup: false,
                toggleControls: true,
                living: false,
                isPublishing: 0,
                hintLiveNotText: '直播结束'
            });
        }
    },

    configWX: function () {
        var self = this;

        //保持常亮状态
        wx.setKeepScreenOn({
            keepScreenOn: true
        });

        //设置小程序title
        wx.setNavigationBarTitle({
            title: self.data.roomTitle
        });

        var systemInfo = wx.getSystemInfoSync();
        self.setData({
            windowHeight: systemInfo.windowHeight,
            windowWidth: systemInfo.windowWidth
        });
    },

    networkChange: function (self, data) {
        clearTimeout(self.data.netConnectStateTimer);

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
        self.data.netConnectStateTimer = setTimeout(netConnectStateTimerCallback, self.data.netConnectState.time);
    },

    onLoad: function (options) {

        // console.log(options);

        var self = this;

        //初始化player播放器
        self.ctx = cc.live.configLivePlayer(self, wx);

        //初始化直播参数
        self.setData({
            roomTitle: decodeURIComponent(options.roomTitle),
            desc: decodeURIComponent(options.desc),
            announcement: decodeURIComponent(options.announcement),
            pdfView: parseInt(decodeURIComponent(options.pdfView)),
            chatView: parseInt(decodeURIComponent(options.chatView)),
            qaView: parseInt(decodeURIComponent(options.qaView)),
            viewerId: decodeURIComponent(options.viewerId),
            viewerName: decodeURIComponent(options.viewerName)
        });

        self.configWX();
        self.configSwiper();
        self.configLiveMode();

        cc.live.on('network_change', function (data) {
            console.log('network_change', data);
            self.networkChange(self, data);
        });

        //是否开始直播
        cc.live.on('isPublishing_log', function (data) {
            self.setData({
                isPublishing: parseInt(data)
            });

            self.configLive();
        });

        //是否禁播
        cc.live.on('isBan_log', function (data) {
            self.setData({
                isBan: data
            });

            self.configLiveIsBan();
        });

        //历史文档页
        cc.live.on('page_change_log', function (data) {
            self.setData({
                pageData: data || ''
            });

            if (self.data.pageData) {
                self.setData({
                    pageHeight: self.data.pageData.height,
                    pageWidth: self.data.pageData.width
                });
            }
        });

        //历史聊天信息
        cc.live.on('chat_log', function (data) {
            self.setData({
                chatLog: data
            });

            self.configChat();
        });

        //收到问题记录
        cc.live.on('question_log', function (data) {
            self.setData({
                questionLog: data
            });
        });

        //返回答案记录
        cc.live.on('answer_log', function (data) {
            self.setData({
                answerLog: data
            });

            self.configQA();
        });

        //禁止播放回掉
        cc.live.on('ban_stream', function () {
            self.banStream();
        });

        //恢复禁播
        cc.live.on('unban_stream', function () {
            self.unbanStream();
        });

        // 直播开始
        cc.live.on('publish_stream', function (data) {
            self.publishStream();
        });

        // 直播结束
        cc.live.on('end_stream', function (data) {
            self.endStream();
        });

        //在线人数
        cc.live.on('room_user_count', function (data) {
            //人数长度限制
            var n = data.length > 8 ? data.split('').splice(0, 8).join('') + '+' : data;
            self.setData({
                peoples: n
            });
        });

        //禁言
        cc.live.on('information', function (data) {
            self.onInformation(data);
        });

        //公告
        cc.live.on('announcement', function (data) {
            self.setData({
                announcement: data.announcement || '暂无'
            });
        });

        //翻页
        cc.live.on('page_change', function (data) {
            self.setData({
                pageUrl: data.value.url,
                pageHeight: data.value.height,
                pageWidth: data.value.width
            });
            if (self.data.fullDocument) {
                self.alignCenter();
            }
        });

        //禁言
        cc.live.on('silence_user_chat_message', function (data) {
            var data = JSON.parse(data);
            var arr = self.data.message;
            var obj = {};
            obj.name = data.username;
            obj.msg = cc.live.showEm(data.msg);
            if (data.userid == self.data.viewerId) {
                obj.type = 1;
            } else {
                obj.type = 0;
            }
            arr.push(obj);
            self.setData({
                message: arr,
                chatLength: arr.length
            });
            if (self.data.toggleChatScroll) {
                self.setData({
                    toChat: 'lastChat'
                });
            }
        });

        //接收公聊
        cc.live.on('chat_message', function (data) {
            var data = JSON.parse(data);
            var arr = self.data.message;
            var obj = {};
            obj.name = data.username;
            obj.msg = cc.live.showEm(data.msg);
            if (data.userid == self.data.viewerId) {
                obj.type = 1;
            } else {
                obj.type = 0;
            }
            arr.push(obj);
            self.setData({
                message: arr.slice(self.data.chatLengthMax),
                chatLength: arr.length
            });
            if (self.data.toggleChatScroll) {
                self.setData({
                    toChat: 'lastChat'
                });
            }
        });

        var questionsCache = self.data.questions;
        //收到问题
        cc.live.on('question', function (data) {
            var data = JSON.parse(data);
            var qObj = {};
            qObj.name = data.value.userName;
            qObj.time = data.value.triggerTime.split(' ')[1];
            qObj.question = data.value.content;
            qObj.answers = [];
            if (data.value.userId == self.data.viewerId) {
                qObj.type = 1;
                qObj.display = true;
            } else {
                qObj.type = 0;
                qObj.display = false;
            }
            qObj.encryptId = data.value.id;
            questionsCache.push(qObj);
            updateQuestion();
        });

        //更新问题
        var updateQuestion = function () {
            var arr = [];
            for (var i = 0; i < questionsCache.length; i++) {
                if (questionsCache[i].display) {
                    arr.push(questionsCache[i]);
                }
            }
            showQuestionAnswer(arr);
        };

        //返回答案
        cc.live.on('answer', function (data) {
            var data = JSON.parse(data);
            var arr = questionsCache;
            var aObj = {};
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].encryptId == data.value.questionId) {
                    aObj.name = data.value.userName;
                    aObj.answer = data.value.content;
                    aObj.isPrivate = data.value.isPrivate;
                    if (data.value.questionUserId == self.data.viewerId) {
                        aObj.isPrivate = 0;
                    }
                    arr[i].answers.push(aObj);
                }
            }
            updateAnswer();
        });

        //更新答案
        var updateAnswer = function () {
            for (var i = 0; i < questionsCache.length; i++) {
                for (var j = 0; j < questionsCache[i].answers.length; j++) {
                    var answers = questionsCache[i].answers[j];
                    if (answers.isPrivate === 0) {
                        questionsCache[i].display = true;
                        break;
                    }
                }
            }
            updateQuestion();
        };

        //显示问答信息
        var showQuestionAnswer = function (arr) {
            self.setData({
                questions: arr,
                questionAnswerLength: arr.length
            });
            if (self.data.toggleQuestionAnswerScroll) {
                self.setData({
                    toQuestionAnswer: 'lastQuestionAnswer'
                });
            }
        };

        //发布问答
        cc.live.on('publish_question', function (data) {
            var data = JSON.parse(data);
            var id = data.value.questionId;
            for (var i = 0; i < questionsCache.length; i++) {
                if (questionsCache[i].encryptId === id) {
                    questionsCache[i].display = true;
                }
            }
            updateQuestion();
        });

        cc.live.on('private_chat', function (data) {
            console.log(data);
        });

        cc.live.on('private_chat_self', function (data) {
            console.log(data);
        });

    },

    //如果直播推流断网，小程序live-player会自动重联一定次数不再播放，调用replay重新尝试播放
    replay: function (e) {
        // 网络断连，且经多次重连抢救无效，更多重试请自行重启播放
        if (e.detail.code === -2301 && this.ctx.domId) {
            //自动切换节点，待完成

            //重新播放
            this.ctx.play({
                success: function (res) {
                    console.log('play success', res);
                },
                fail: function (res) {
                    console.log('play fail', res);
                }
            });
        }
    },

    statechange: function (e) {
        this.replay(e);
        // cc.live.statechange(e);
        //统计上报功能
        // cc.live.reportPlayResult(e);
    },

    netstatus: function (e) {
        // cc.live.netstatus(e);
        //统计上报功能
        // cc.live.reportPlaying(e);
    },

    /// 按钮触摸开始触发的事件
    bindTouchStart: function (e) {
        this.touchStartTime = e.timeStamp;
    },

    /// 按钮触摸结束触发的事件
    bindTouchEnd: function (e) {
        this.touchEndTime = e.timeStamp;
    },

    bindDoubleTap: function (e) {
        var self = this;
        // 控制点击事件在350ms内触发，加这层判断是为了防止长按时会触发点击事件
        if (self.touchEndTime - self.touchStartTime < 350) {
            // 当前点击的时间
            var currentTime = e.timeStamp;
            var lastTapTime = self.lastTapTime;
            // 更新最后一次点击时间
            self.lastTapTime = currentTime;

            // 如果两次点击时间在300毫秒内，则认为是双击事件
            if (currentTime - lastTapTime < 300) {
                // 成功触发双击事件时，取消单击事件的执行
                clearTimeout(self.lastTapTimeoutFunc);
                if (self.data.model === 'videoModel') {
                    //双击退出全屏
                    self.ctx.exitFullScreen({
                        success: function (res) {
                            console.log('exitFullScreen success');
                        },
                        fail: function (res) {
                            console.log('exitFullScreen fail');
                        }
                    });
                    self.setData({
                        toggleExitFullScreenBtn: false
                    });
                }
            }
        }
    },

    bindExitFullScreen: function () {
        var self = this;
        //ios live-player 不支持 bindtap
        self.ctx.exitFullScreen({
            success: function (res) {
                console.log('exitFullScreen success');
            },
            fail: function (res) {
                console.log('exitFullScreen fail');
            }
        });
        self.setData({
            toggleExitFullScreenBtn: false
        });
    },

    //选择表情
    bindEmoji: function (e) {
        var index = e.currentTarget.dataset.index;
        var msg = this.data.chatMsg;
        if (index !== 21) {
            var emoji = '[em2_' + (index < 10 ? '0' + index : index) + ']';
            msg += emoji;
        } else {
            //删除
            var arr = msg.split('');
            arr.pop();
            msg = arr.join('');
        }
        this.setData({
            chatMsg: msg
        });
    },

    //开关表情界面
    bindToggleEmoji: function () {
        if (!this.data.netConnectState.state) {
            return;
        }
        if (this.data.toggleEmoji) {
            this.setData({
                emoji: 'emoji',
                toggleEmoji: false,
            });
        } else {
            this.setData({
                emoji: 'emoji-select',
                toggleEmoji: true,
            });
        }
    },

    //问答输入框获取焦点
    bindQuestionInputFocus: function (e) {
        this.setData({
            topQuestionInputHeight: e.detail.height
        });
    },

    //问答输入框失去焦点
    bindQuestionInputBlur: function (e) {
        this.setData({
            topQuestionInputHeight: 0
        });
    },

    //切换问答显示模式
    bindShowQuestion: function () {
        var self = this;
        if (self.data.toggleShowQuestion) {
            self.setData({
                eye: 'eye-hidden',
                toggleShowQuestion: false,
                toggleHintShowQuestion: true,
                hintShowQuestion: '只看我的问答',
            });
        } else {
            self.setData({
                eye: 'eye',
                toggleShowQuestion: true,
                toggleHintShowQuestion: true,
                hintShowQuestion: '显示所有问答',
            });
        }
        setTimeout(timer, 1500);

        function timer() {
            self.setData({
                toggleHintShowQuestion: false,
                hintShowQuestion: '',
            });
        }

        self.setData({
            toQuestionAnswer: 'lastQuestionAnswer'
        });
    },

    //验证输入框信息不能为空，小于140字
    checkoutInput: function (value) {
        var self = this;
        if (!value) {
            self.setData({
                toggleCheckoutInputHint: true,
                checkoutInputHint: '聊天信息不能为空',
            });
            setTimeout(timer, 1200);
            return false;
        }
        if (value.length >= 140) {
            self.setData({
                toggleCheckoutInputHint: true,
                checkoutInputHint: '聊天信息应小于140字',
            });
            setTimeout(timer, 1200);
            return false;
        }
        return true;

        function timer() {
            self.setData({
                toggleCheckoutInputHint: false,
                checkoutInputHint: '',
            });
        }
    },

    onInformation: function (info) {
        var self = this;

        self.setData({
            toggleCheckoutInputHint: true,
            checkoutInputHint: info,
        });
        setTimeout(timer, 2000);

        function timer() {
            self.setData({
                toggleCheckoutInputHint: false,
                checkoutInputHint: '',
            });
        }
    },

    //发送问题
    bindSendQuestionMsg: function () {
        if (!this.checkoutInput(this.data.question)) {
            return;
        }
        cc.live.sendQuestionMsg(this.data.question);
        this.setData({
            question: ''
        });
    },

    //输入问题
    bindQuestionAnswerInput: function (e) {
        var question = e.detail.value;
        this.setData({
            question: question
        });
    },

    //用户滑动观看问答内容，禁止内容自动滑动
    bindQuestionAnswerScroll: function (e) {
        var height = e.detail.scrollHeight;
        var top = e.detail.scrollTop;
        if (height - top > 400) {
            this.setData({
                toggleQuestionAnswerScroll: false
            });
        }
    },

    //问答信息滑动到底部，开启问答内容自动更新滑动
    bindQuestionAnswerScrollTolower: function (e) {
        this.setData({
            toggleQuestionAnswerScroll: true
        });
    },

    //发送聊天信息
    bindSendPublicChatMsg: function () {
        if (!this.checkoutInput(this.data.chatMsg)) {
            return;
        }
        cc.live.sendPublicChatMsg(this.data.chatMsg);
        this.setData({
            chatMsg: '',
            emoji: 'emoji',
            toggleEmoji: false
        });
    },

    //输入聊天信息
    bindChatInput: function (e) {
        var msg = e.detail.value;
        this.setData({
            chatMsg: msg
        });
    },

    //聊天输入框获取焦点，键盘弹起输入框
    bindChatInputFocus: function (e) {
        this.setData({
            topChatInputHeight: e.detail.height,
            emoji: 'emoji',
            toggleEmoji: false
        });
    },

    //聊天输入框失去焦点
    bindChatInputBlur: function (e) {
        this.setData({
            topChatInputHeight: 0
        });
    },

    //允许聊天内容自动滑动
    bindChatScrollTolower: function (e) {
        this.setData({
            toggleChatScroll: true
        });
    },

    //禁止聊天内容自动滑动
    bindChatScroll: function (e) {
        var height = e.detail.scrollHeight;
        var top = e.detail.scrollTop;
        if (height - top > 400) {
            this.setData({
                toggleChatScroll: false
            });
        }
    },

    //全屏
    bindSwitchoverFullScreen: function () {
        switch (this.data.btnSwitchoverFullScreen) {
            case 'switchover':
                if (this.data.toggleSwitchover) {
                    this.setData({
                        dbView: false
                    });
                    this.setData({
                        switchPip: ['switch-pip-document', 'switch-pip-image', 'switch-pip-player'],
                        toggleCover: [false, true],
                        playerView: 1,
                        btnTogglePlayerLiveMode: 'hidden-video',
                        toggleSwitchover: false,
                        togglePlayer: false,
                        dbWidth: '240rpx',
                        dbHeight: '180rpx',
                        dbView: true
                    });
                } else {
                    this.setData({
                        dbView: false
                    });
                    this.setData({
                        switchPip: ['', '', ''],
                        toggleCover: [true, false],
                        playerView: 1,
                        btnTogglePlayerLiveMode: 'hidden-video',
                        toggleSwitchover: true,
                        togglePlayer: false,
                        dbWidth: '100%',
                        dbHeight: '423rpx',
                        dbView: true
                    });
                }
                break;
            case 'full-screen':
                this.ctx.requestFullScreen({
                    success: function (res) {
                        console.log('requestFullScreen success');
                    },
                    fail: function (res) {
                        console.log('requestFullScreen fail');
                    }
                });
                this.setData({
                    toggleExitFullScreenBtn: true
                });
                break;
        }
    },

    //全屏事件回掉
    bindFullScreenChange: function (e) {
        if (e.detail.fullScreen) {
            this.setData({
                toggleCover: [false, false],
                orientation: 'horizontal',
                // toggleControls:
            });
        } else {
            this.setData({
                toggleCover: [false, true],
                orientation: 'vertical'
            });
        }
    },

    //切换音频视频模式
    bindTogglePlayerLiveMode: function () {
        switch (this.data.btnTogglePlayerLiveMode) {
            case 'hidden-video':
            case 'show-video':
                if (this.data.toggleSwitchover) {
                    if (this.data.togglePlayer) {
                        this.setData({
                            playerView: 1,
                            btnTogglePlayerLiveMode: 'hidden-video',
                            togglePlayer: false
                        });
                    } else {
                        this.setData({
                            playerView: 0,
                            btnTogglePlayerLiveMode: 'show-video',
                            togglePlayer: true
                        });
                    }
                } else {
                    this.setData({
                        dbView: false
                    });
                    this.setData({
                        switchPip: ['', '', ''],
                        toggleCover: [true, false],
                        playerView: 0,
                        btnTogglePlayerLiveMode: 'show-video',
                        toggleSwitchover: true,
                        togglePlayer: true,
                        dbWidth: '100%',
                        dbHeight: '423rpx',
                        dbView: true
                    });
                }
                break;
            case 'video-live':
            case 'only-audio':
                if (this.data.audioMode) {
                    this.setData({
                        mode: 'video',
                        audioMode: false, //视频模式
                        btnTogglePlayerLiveMode: 'video-live'
                    });
                } else {
                    this.setData({
                        mode: 'audio',
                        audioMode: true, //音频模式
                        btnTogglePlayerLiveMode: 'only-audio'
                    });
                }
                cc.live.streamMode(this.data.mode);
                break;
        }
    },

    //线路选择菜单开关
    bindToggleSelectRoute: function () {
        if (this.data.toggleSelectRoute) {
            this.setData({
                toggleSelectRoute: false
            });
        } else {
            this.setData({
                toggleSelectRoute: true
            });
        }
    },

    //选择线路
    bindSelectRoute: function (e) {
        var route = e.target.dataset.index;
        switch (route) {
            case 0:
                cc.live.streamRoute(0);
                break;
            case 1:
                cc.live.streamRoute(1);
                break;
            case 2:
                cc.live.streamRoute(2);
                break;
        }
        this.setData({
            toggleSelectRoute: false, //选择线路  
            RouteOptionActive: route
        });
    },

    //直播中
    catchLiving: function () {
        var self = this;
        this.setData({
            toggleControls: true,
            living: false
        });
        self.data.toggleLiveControlsTimer = setTimeout(function () {
            if (!self.data.isPublishing || self.data.isBan) {
                return;
            }
            self.setData({
                toggleControls: false,
                living: true,
                toggleSelectRoute: false
            });
        }, 5000);
    },

    //控制面板
    catchControls: function () {
        var self = this;
        if (!self.data.isPublishing || self.data.isBan) {
            return;
        }
        clearTimeout(self.data.toggleLiveControlsTimer);
        self.setData({
            toggleControls: false,
            living: true,
            toggleSelectRoute: false
        });
    },

    //公告
    catchNotice: function () {
        this.setData({
            toggleNotice: true
        });
    },

    //公告
    catchCloseNotice: function () {
        this.setData({
            toggleNotice: false
        });
    },

    //选项卡
    bindTab: function (e) {
        var index = e.currentTarget.dataset.index;
        this.setData({
            tabOptionSelected: index
        });
    },

    //选中样式
    bindSwiperChange: function (e) {
        if (e.detail.source === 'touch') {
            var index = e.detail.current;
            this.setData({
                tabOptionSelected: index
            });
        }
    }

});