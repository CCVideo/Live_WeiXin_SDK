var cc = getApp().globalData.ccsdk;

// components/replay/cclive-player/cclive-live.js
Component({

    externalClasses: ["player-class"],

    properties: {
        _stopInterval: {
            type: Boolean,
            value: false,
            observer: function (newVal) {
                if (newVal) {
                    this.stopInterval();
                }
            }
        },
        netconnectstate: {
            type: Object,
            value: {},
            observer: function (newVal) {

            }
        },
        initialTime: {
            type: Number,
            value: 0
        },
        duration: {
            type: Number,
            value: 0
        },
        controls: {
            type: Boolean,
            value: false
        },
        autoplay: {
            type: Boolean,
            value: true
        },
        loop: {
            type: Boolean,
            value: false
        },
        muted: {
            type: Boolean,
            value: false
        },
        direction: {
            type: Number,
            value: 0
        },
        objectFit: {
            type: String,
            value: "contain"
        },
        showCenterPlayBtn: {
            type: Boolean,
            value: false
        }
    },

    data: {
        playerUrl: "",
        enableProgressGesture: false,
        togglePlayer: true
    },

    methods: {
        bindPlay: function (e) {
            this.startInterval();

            cc.replay.listenerplay(e);

            var myEventDetail = e.detail;
            var myEventOption = {};
            this.triggerEvent("play", myEventDetail, myEventOption);
        },
        bindPause: function (e) {

            var myEventDetail = e.detail;
            var myEventOption = {};
            this.triggerEvent("pause", myEventDetail, myEventOption);
        },
        bindEnded: function (e) {
            this.stopInterval();

            cc.replay.listenerended(e);

            var myEventDetail = e.detail;
            var myEventOption = {};
            this.triggerEvent("ended", myEventDetail, myEventOption);
        },
        bindTimeupdate: function (e) {
            this.setTimestamp(e);
        },
        _timeupdate: function () {
            var e = this.getTimestamp();
            if (!e.detail) {
                return;
            }

            cc.replay.timeupdate(e);

            this.setCurrentTime(e);

            var myEventDetail = e.detail;
            var myEventOption = {};
            this.triggerEvent("timeupdate", myEventDetail, myEventOption);

            if (!this._interval) {
                this.startInterval();
            }
        },
        bindWaiting: function (e) {

            cc.replay.waiting(e);

            var myEventDetail = e.detail;
            var myEventOption = {};
            this.triggerEvent("waiting", myEventDetail, myEventOption);
        },
        bindFullscreenchange: function (e) {
            var myEventDetail = e.detail;
            var myEventOption = {};
            this.triggerEvent("fullscreenchange", myEventDetail, myEventOption);
        },
        bindError: function (e) {

            this.onErrorReplay(e);

            cc.replay.error(e);

            var myEventDetail = e.detail;
            var myEventOption = {};
            this.triggerEvent("error", myEventDetail, myEventOption);
        },
        setTimestamp: function (e) {
            this.timestamp = e;
        },
        getTimestamp: function () {
            return this.timestamp;
        },
        setCurrentTime: function (e) {
            this.currentTime = e.detail.currentTime;
        },
        onErrorReplay: function (e) {
            // console.log("bindError", e);
        },

        startInterval: function () {
            var _this = this;
            _this.stopInterval();
            _this._interval = setInterval(function () {
                _this._timeupdate();
            }, 999);
        },
        stopInterval: function () {
            var _this = this;
            clearInterval(_this._interval);
            _this._interval = 0;
            _this.timestamp = {};
        }
    },

    ready: function () {
        var _this = this;
        _this.videoContext = cc.replay.configPlayer(_this, wx);
        _this.currentTime = 0;
        _this.timestamp = {};
        _this._interval = 0;
    }
});

