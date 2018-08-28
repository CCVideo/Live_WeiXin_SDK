var cc = getApp().globalData.ccsdk;

// pages/replay/repaly/replay.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        room_info: {},
        template_info: {},
        questions_info: [],
        answers_info: [],
        chat_msg_info: [],

        initSwiper: [],
        initIntro: {},
        initQa: {},

        replayMode: 'document',//直播模版
        isPlayerDocument: 'document',//切换播放器文档
        renderer: true,//渲染文档画板：如果改变文档画板大小，必须重新渲染以获取最新尺寸。
        showHidePlayer: true,
        showHideDcument: true,
        playState: 'play',
        time: {},
        fullscreenBtnDisabled: false,
        fullscreen: false,
        fullDocument: '',
        documentTop: 0,
        pageHeight: 0,
        pageWidth: 0,
        windowHeight: 0,
        windowWidth: 0,
        documentHeight: '100%',
        toggleDocuemntFullScreen:'document',
        //测试进度条
        max: 100,
        min: 0
    },
    renderDocuemnt:function(){
        if(this.data.playState === 'play'){
            return;
        }
        this.setData({
            renderer:false
        })
        this.setData({
            renderer:true
        })
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
            fullDocument: 'full-document',
            isPlayerDocument: 'video'
        });
        this.hidePlayer();
        this.alignCenter();
        this.renderDocuemnt();
    },

    docuemntExitFullScreen: function () {
        if (!this.data.fullDocument) {
            return;
        }
        this.setData({
            fullDocument: '',
            isPlayerDocument: 'document',
            documentHeight: '100%'
        });
        this.showPlayer();
        this.alignTop();
        this.renderDocuemnt();
    },

    //文档全屏
    bindDocuemntFullScreen: function () {
        if(this.data.toggleDocuemntFullScreen === 'video'){
            return;
        }
        if (this.data.fullDocument) {
            this.docuemntExitFullScreen();
        } else {
            this.docuemntFullScreen();
        }
    },

    //测试进度条
    bindChange: function (e) {
        clearTimeout(this.timer);
        this.timer = setTimeout(function () {
            cc.replay.seek(e.detail.value);
        }, 1500);
    },

    catchFullscreen: function () {
        this.toggleFullScreen();
    },

    toggleFullScreen: function () {
        if (this.data.fullscreen) {
            cc.replay.exitFullScreen();
        } else {
            cc.replay.requestFullScreen();
        }
    },

    bindFullscreenchange: function (e) {
        this.setData({
            fullscreen: e.detail.fullScreen
        });

        if (this.data.fullscreen) {
            this.hideDocument();
        } else {
            this.showDocument();
            this.showPlayer();
        }
    },

    bindTimeupdate: function (e) {
        //测试进度条
        this.setData({
            max: e.detail.duration
        });
        this.setData({
            time: e
        });
    },

    bindPlay: function (e) {
        this.setData({
            playState: 'play'
        });
    },

    bindPause: function (e) {
        this.setData({
            playState: 'pause'
        });
    },

    bindEnded: function (e) {
        this.setData({
            playState: 'ended'
        });
    },

    catchSwitch: function (e) {
        this.togglePlayerDocument();
    },

    catchShowHide: function (e) {
        this.toggleShowHide();
    },

    // 切换显示隐藏
    toggleShowHide: function () {
        if (this.data.replayMode === 'video') {
            return;
        }
        if (this.data.isPlayerDocument === 'video') {
            if (this.data.showHideDcument) {
                this.hideDocument();
            } else {
                this.showDocument();
            }
        } else {
            if (this.data.showHidePlayer) {
                this.hidePlayer();
            } else {
                this.showPlayer();
            }
        }
    },

    //显示文档
    showDocument: function () {
        this.setData({
            showHideDcument: true
        });
    },

    //隐藏文档
    hideDocument: function () {
        this.setData({
            showHideDcument: false
        });
    },

    //显示播放器
    showPlayer: function () {
        this.setData({
            showHidePlayer: true
        });
    },

    //隐藏播放器
    hidePlayer: function () {
        this.setData({
            showHidePlayer: false
        });
    },

    //切换视频/文档为主
    togglePlayerDocument: function () {
        if (this.data.isPlayerDocument === 'video') {
            this.toggleDocument();
        } else {
            this.togglePlayer();
        }
    },

    //视频为主
    togglePlayer: function () {
        if (this.data.replayMode === 'video') {
            return;
        }
        this.setData({
            showHidePlayer: true,
            isPlayerDocument: 'video',
            toggleDocuemntFullScreen:'video',
            renderer: false
        });
        this.rendererDocument();
    },

    //文档为主
    toggleDocument: function () {
        if (this.data.replayMode === 'video') {
            return;
        }
        this.setData({
            showHideDcument: true,
            isPlayerDocument: 'document',
            toggleDocuemntFullScreen:'document',
            renderer: false
        });
        this.rendererDocument();
    },

    rendererDocument: function () {
        this.setData({
            renderer: true
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //定时器
        this.timer = {};
        // 初始化数据
        this.initData(options);
        //初始化回放
        this.initReplay();
        //ListenerEvents
        this.ListenerEvents();
    },

    ListenerEvents: function () {
        var self = this;
        cc.replay.on('pages_change_sync', function (data) {
            self.setData({
                pageHeight: data.height,
                pageWidth: data.width
            });
            if (self.data.fullDocument) {
                self.alignCenter();
            }
        });
    },

    initReplay: function () {
        //配置微信参数：屏幕常亮、回放标题等
        this.configWx();
        //配置回放：回放模版等
        this.configReplay();
        //配置组件数据
        this.configComponents();
    },
    configReplay: function () {
        var data = this.data.template_info;

        if (data.pdfView) {
            this.setData({
                replayMode: 'document',
                isPlayerDocument: 'document',
                toggleDocuemntFullScreen:'document'
            });
        } else {
            this.setData({
                replayMode: 'video',
                isPlayerDocument: 'video',
                toggleDocuemntFullScreen:'video',
            });
        }
    },
    configWx: function () {
        var data = this.data.room_info;
        //设置小程序title
        wx.setNavigationBarTitle({
            title: data.name || ''
        });
        //保持常亮状态
        wx.setKeepScreenOn({
            keepScreenOn: true
        });
        //获取屏幕宽高
        var systemInfo = wx.getSystemInfoSync();
        this.setData({
            windowHeight: systemInfo.windowHeight,
            windowWidth: systemInfo.windowWidth
        });
    },
    configComponents: function () {
        //配置swiper组件
        this.configSwiper();
        //配置聊天组件
        this.configChat();
        //配置简介组件
        this.configIntro();
        //配置问答
        this.configQa();
        //配置问答
        this.configControl();
    },
    configControl: function () {

    },
    configSwiper: function () {
        var data = this.data.template_info;
        var initSwiper = [];

        var tabConetent = [];
        if (data.chatView) {
            initSwiper.push({name: 'chat', content: '聊天记录'});
        }
        if (data.qaView) {
            initSwiper.push({name: 'qa', content: '问答记录'});
        }
        initSwiper.push({name: 'intro', content: '简介'});

        this.setData({
            initSwiper: initSwiper
        });
    },
    configIntro: function () {
        var data = this.data.room_info;
        var initIntro = {};
        initIntro.title = data.name;
        initIntro.intro = data.desc;
        this.setData({
            initIntro: initIntro
        });
    },
    configChat: function () {

    },
    configQa: function () {
        var data = {
            questions_info: this.data.questions_info,
            answers_info: this.data.answers_info
        };
        var initQa = {};
        initQa = data;
        this.setData({
            initQa: initQa
        });
    },
    initData: function (options) {
        this.setData({
            room_info: JSON.parse(decodeURIComponent(options.room_info || '{}')),
            template_info: JSON.parse(decodeURIComponent(options.template_info || '{}')),
            questions_info: JSON.parse(decodeURIComponent(options.questions_info || '[]')),
            answers_info: JSON.parse(decodeURIComponent(options.answers_info || '[]')),
            chat_msg_info: JSON.parse(decodeURIComponent(options.chat_msg_info || '[]'))
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        if (this.data.playState === 'pause') {
            cc.replay.play();
        } else {
            cc.replay.pause();
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        cc.replay.quit();
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
});