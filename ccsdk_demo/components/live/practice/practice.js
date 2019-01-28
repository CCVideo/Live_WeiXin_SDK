var cc = getApp().globalData.ccsdk;
// components/live/practice/practice.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {},

    /**
     * 组件的初始数据
     */
    data: {
        practiceId: "XXXX2345",
        toggleContainer: "none",
        practice: "",
        options: ""
    },

    /**
     * 组件的方法列表
     */
    methods: {
        toggleParctice: function () {
            if (this.data.toggleContainer === "none") {
                this.setData({
                    toggleContainer: "block"
                });
            } else {
                this.setData({
                    toggleContainer: "none"
                });
            }
        },
        getPracticeInfo: function () {
            var self = this;
            //获取随堂测信息接口API
            cc.live.getPracticeInfo({
                practiceId: self.data.practiceId,
                success: function (res) {
                    console.log("getPracticeInfo success", res.data.datas);
                    wx.showModal({
                        title: "获取随堂测信息接口API",
                        content: JSON.stringify(res.data.datas),
                        showCancel: false,
                    });
                    self.setData({
                        practice: res.data.datas.practice
                    });
                },
                fail: function (error) {
                    console.log("getPracticeInfo fail", error);
                }
            });
        },
        checkboxChange: function (e) {
            console.log("checkbox发生change事件，携带value值为：", e.detail.value);
            var options = "";
            var values = e.detail.value;
            for (var i = 0; i < values.length; i++) {
                options += values[i] + ",";
            }
            options.trim();
            options = options.substr(0, options.length - 1);
            this.setData({
                options: options
            });
        },
        radioChange: function (e) {
            console.log("radio发生change事件，携带value值为：", e.detail.value);
            this.setData({
                options: e.detail.value
            });
        },
        uniq: function (array) {
            var temp = []; //一个新的临时数组
            for (var i = 0; i < array.length; i++) {
                if (temp.indexOf(array[i]) == -1) {
                    temp.push(array[i]);
                }
            }
            return temp;
        },
        submitPractice: function () {
            var self = this;
            var options = self.data.options;
            //提交随堂测接口API
            cc.live.submitPractice({
                practiceId: self.data.practiceId,
                options: options,
                success: function (res) {
                    console.log("submitPractice success", res.data.datas);
                    wx.showModal({
                        title: "提交随堂测接口API",
                        content: JSON.stringify(res.data.datas),
                        showCancel: false,
                    });
                },
                fail: function (error) {
                    console.log("submitPractice fail", error);
                }
            });
        },
        getPracticeStatis: function () {
            var self = this;
            //获取随堂测统计信息接口API
            cc.live.getPracticeStatis({
                practiceId: self.data.practiceId,
                success: function (res) {
                    console.log("getPracticeStatis success", res.data.datas);
                    wx.showModal({
                        title: "获取随堂测统计信息接口API",
                        content: JSON.stringify(res.data.datas),
                        showCancel: false,
                    });
                },
                fail: function (error) {
                    console.log("getPracticeStatis fail", error);
                }
            });
        },
        getPracticeRank: function () {
            var self = this;
            //获取排名数据接口API
            cc.live.getPracticeRank({
                practiceId: self.data.practiceId,
                success: function (res) {
                    console.log("getPracticeRank success", res.data.datas);
                    wx.showModal({
                        title: "获取排名数据接口API",
                        content: JSON.stringify(res.data.datas),
                        showCancel: false,
                    });
                },
                fail: function (error) {
                    console.log("getPracticeRank fail", error);
                }
            });
        }
    },

    ready: function () {
        var self = this;
        //发布随堂测事件
        cc.live.on("practice_publish", function (data) {
            console.log("practice_publish", data);
            var _data = JSON.parse(data);
            self.setData({
                practiceId: _data.practiceId
            });
            wx.showModal({
                title: "发布随堂测",
                content: JSON.stringify(data),
                showCancel: false,
            });
            self.setData({
                options: ""
            });
        });

        //停止随堂测事件
        cc.live.on("practice_stop", function (data) {
            console.log("practice_stop", data);
            var _data = JSON.parse(data);
            self.setData({
                practiceId: _data.practiceId
            });
            wx.showModal({
                title: "停止随堂测",
                content: JSON.stringify(data),
                showCancel: false,
            });
        });

        //关闭随堂测事件
        cc.live.on("practice_close", function (data) {
            console.log("practice_close", data);
            var _data = JSON.parse(data);
            self.setData({
                practiceId: _data.practiceId
            });
            wx.showModal({
                title: "关闭随堂测",
                content: JSON.stringify(data),
                showCancel: false,
            });
        });
    }
});
