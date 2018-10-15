var cc = getApp().globalData.ccsdk;

// components/replay/control/control.js
Component({

    /**
     * 组件的属性列表
     */
    properties: {
        replayMode: {
            type: String,
            value: 'document'
        },
        showHide: {
            type: Boolean,
            value: true
        },
        play: {
            type: String,
            value: ''
        },
        time: {
            type: Object,
            value: {},
            observer: '_setTime'
        },
        fullscreen: {
            type: Boolean,
            value: false
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        toggleControl: true,
        timer: {},
        currentTime: '00:00',
        duration: '00:00',
        Duration: 0,
        togglePlay: true,
        loadingbarWidth: 0,
        percent: 0,
        progressActive: true,
        left: 0
    },

    /**
     * 组件的方法列表
     */
    methods: {
        _formatSeconds: function (value) {
            var secondTime = parseInt(value);// 秒
            var minuteTime = 0;// 分
            var hourTime = 0;// 小时
            if (secondTime > 60) {//如果秒数大于60，将秒数转换成整数
                //获取分钟，除以60取整数，得到整数分钟
                minuteTime = parseInt(secondTime / 60);
                //获取秒数，秒数取佘，得到整数秒数
                secondTime = parseInt(secondTime % 60);
                //如果分钟大于60，将分钟转换成小时
                if (minuteTime > 60) {
                    //获取小时，获取分钟除以60，得到整数小时
                    hourTime = parseInt(minuteTime / 60);
                    //获取小时后取佘的分，获取分钟除以60取佘的分
                    minuteTime = parseInt(minuteTime % 60);
                }
            }
            var result = '' + secondTime;
            result = result < 10 ? '0' + result : result;
            secondTime = secondTime < 10 ? '0' + secondTime : secondTime;

            if (minuteTime > 0) {
                minuteTime = minuteTime < 10 ? '0' + minuteTime : minuteTime;
                result = '' + minuteTime + ':' + result;
            } else {
                minuteTime = '00';
                result = '' + minuteTime + ':' + result;
            }

            if (hourTime > 0) {
                hourTime = hourTime < 10 ? '0' + hourTime : hourTime;
                result = '' + hourTime + ':' + result;
            }
            return result;
        },
        _setTime: function (newVal) {
            if (JSON.stringify(newVal) === '{}') {
                return;
            }
            this.setData({
                currentTime: this._formatSeconds(newVal.detail.currentTime),
                duration: this._formatSeconds(newVal.detail.duration),
                Duration: newVal.detail.duration,
            });
            if (this.data.progressActive) {
                this.setData({
                    percent: this._formatePercent(newVal.detail.currentTime, newVal.detail.duration)
                });
                var nowLeft = (this.data.percent * this.data.loadingbarWidth);
                var left = this.data.loadingbarWidth;
                this.setData({
                    left: (nowLeft >= left - 12) ? (nowLeft - 12) : nowLeft
                });
            }
        },
        _formatePercent: function (currentTime, duration) {
            var percent = (currentTime / duration);
            return percent.toFixed(2);
        },
        _bindControl: function () {
            if (this.data.toggleControl) {
                this._hideControl();
                clearTimeout(this.data.timer);
            } else {
                this._showControl();

                var self = this;
                this.data.timer = setTimeout(function () {
                    self._hideControl();
                }, 5000);
            }
        },
        _hideControl: function () {
            this.setData({
                toggleControl: false
            });
        },
        _showControl: function () {
            this.setData({
                toggleControl: true
            });
        },
        _catchSwitch: function (e) {
            var myEventDetail = e.detail;
            var myEventOption = {};
            this.triggerEvent('switch', myEventDetail, myEventOption);
        },
        _catchShowHide: function (e) {
            if (this.properties.showHide) {
                this.setData({
                    showHide: false
                });
            } else {
                this.setData({
                    showHide: true
                });
            }
            var myEventDetail = e.detail;
            var myEventOption = {};
            this.triggerEvent('showhide', myEventDetail, myEventOption);
        },
        _catchPlay: function () {
            if (this.data.togglePlay) {
                this.setData({
                    togglePlay: false
                });
                cc.replay.pause();
            } else {
                this.setData({
                    togglePlay: true
                });
                cc.replay.play();
            }
        },
        _catchFullscreen: function (e) {
            var myEventDetail = e.detail;
            var myEventOption = {};
            this.triggerEvent('fullscreen', myEventDetail, myEventOption);
        },
        _getLoadingBarSize: function () {
            var self = this;
            var query = wx.createSelectorQuery().in(self);
            query.select('#loadingbar').boundingClientRect(function (res) {
                if (!res.width) {
                    return false;
                }
                self.setData({
                    loadingbarWidth: res.width,
                    toggleControl: false
                });
            }).exec();
        },
        _catchtouchstart: function () {
            clearTimeout(this.data.timer);
            this.setData({
                progressActive: false
            });
        },
        _catchtouchend: function () {
            this.setData({
                progressActive: true
            });
            var s = parseFloat(this.data.percent) * this.data.Duration;
            cc.replay.seek(s);

            var self = this;
            this.data.timer = setTimeout(function () {
                self._hideControl();
            }, 5000);
        },
        _catchLoadingbarTouchmove: function (e) {
            this.setData({
                percent: this._getParcent(e).percent,
                left: this._getParcent(e).left
            });
        },
        _getParcent: function (e) {
            var pageX = e.touches[0].pageX;
            var offsetLeft = e.currentTarget.offsetLeft;
            var nowX = pageX - offsetLeft;
            var width = this.data.loadingbarWidth;

            var percent = this.data.percent;
            var left = this.data.left;
            var data = {
                left: left,
                percent: percent
            };
            if (nowX >= 0 && nowX <= width) {
                data = {
                    left: nowX <= width - 12 ? nowX : width - 12,
                    percent: (nowX / width).toFixed(2)
                };
            }
            return data;
        }
    },
    ready: function () {
        var self = this;

        self._getLoadingBarSize();

    }
});
