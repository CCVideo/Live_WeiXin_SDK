var cc = getApp().globalData.ccsdk;

// components/replay/cclive-player/cclive-live.js
Component({

    externalClasses: ['player-class'],

    properties: {
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
            value: 'contain'
        },
        showCenterPlayBtn: {
            type: Boolean,
            value: false
        }
    },

    data: {
        playerUrl: ''
    },

    methods: {
        bindPlay: function (e) {
            cc.replay.listenerplay(e);

            var myEventDetail = e.detail;
            var myEventOption = {};
            this.triggerEvent('play', myEventDetail, myEventOption);
        },
        bindPause: function (e) {
            var myEventDetail = e.detail;
            var myEventOption = {};
            this.triggerEvent('pause', myEventDetail, myEventOption);
        },
        bindEnded: function (e) {
            cc.replay.listenerended(e);

            var myEventDetail = e.detail;
            var myEventOption = {};
            this.triggerEvent('ended', myEventDetail, myEventOption);
        },
        bindTimeupdate: function (e) {
            cc.replay.timeupdate(e);

            var myEventDetail = e.detail;
            var myEventOption = {};
            this.triggerEvent('timeupdate', myEventDetail, myEventOption);
        },
        bindWaiting: function (e) {
            cc.replay.waiting(e);

            var myEventDetail = e.detail;
            var myEventOption = {};
            this.triggerEvent('waiting', myEventDetail, myEventOption);
        },
        bindFullscreenchange: function (e) {
            var myEventDetail = e.detail;
            var myEventOption = {};
            this.triggerEvent('fullscreenchange', myEventDetail, myEventOption);
        },
        bindError: function (e) {
            cc.replay.error(e);

            var myEventDetail = e.detail;
            var myEventOption = {};
            this.triggerEvent('error', myEventDetail, myEventOption);
        }
    },

    ready: function () {
        var videoContext = cc.replay.configPlayer(this, wx);
    }
})
;
