var cc = getApp().globalData.ccsdk;
// components/live/lottery/lottery.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        viewerId: {
            type: String,
            value: ""
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        isWin: false,
        prize: [],
        prizeText: "",
        prizeInfo: "",
        winText: "",
        winClass: ""
    },

    /**
     * 组件的方法列表
     */
    methods: {
        bindClose: function () {
            this.triggerEvent("close", {}, {});
        },
        startLottery: function () {
            this.setData({
                prize: [{
                    name: "img",
                    attrs: {
                        // src: "../../../components/img/live/player/lottery/prize.gif",
                        src: "https://static.csslcloud.net/img/lottery/prize.gif",
                        style: "width:227px;height:149px;background-color:#FFE1E1"
                    }
                }],
                prizeText: "",
                prizeInfo: "",
                winText: "",
                winClass: "",
                isWin: false
            });
            this.triggerEvent("startlottery", {}, {});
        },
        winLottery: function (num) {
            this.setData({
                prize: [{
                    name: "img",
                    attrs: {
                        // src: "../../../components/img/live/player/lottery/win_lottery.png",
                        src: "https://static.csslcloud.net/img/lottery/win_lottery.png",
                        style: "width:237px;height:118px;"
                    }
                }],
                prizeText: "恭喜您中奖啦！",
                prizeInfo: "请牢记您的中奖码",
                winText: num,
                winClass: "win-text",
                isWin: true
            });
            this.triggerEvent("winlottery", {}, {});
        },
        missLottery: function (name) {
            this.setData({
                prize: [{
                    name: "img",
                    attrs: {
                        // src: "../../../components/img/live/player/lottery/miss_lottery.png",
                        src: "https://static.csslcloud.net/img/lottery/miss_lottery.png",
                        style: "width:237px;height:118px;"
                    }
                }],
                prizeText: "哎呀，就差一点！",
                prizeInfo: "中奖者",
                winText: name,
                winClass: "miss-text"
            });
            this.triggerEvent("misslottery", {}, {});
        },
        stopLottery: function () {

        },
    },

    ready: function () {
        var self = this;
        cc.live.on("start_lottery", function (data) {
            console.log("start_lottery", data);
            var _data = JSON.parse(data);
            self.startLottery();
        });

        cc.live.on("win_lottery", function (data) {
            console.log("win_lottery", data);
            var _data = JSON.parse(data);
            if (_data.viewerId === self.data.viewerId) {
                self.winLottery(_data.lotteryCode);
            } else {
                if(!self.data.isWin){
                    self.missLottery(_data.viewerName);
                }
            }
        });

        cc.live.on("stop_lottery", function (data) {
            console.log("stop_lottery", data);
            self.stopLottery();
        });
    }
});
