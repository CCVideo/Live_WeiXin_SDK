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
        info: ''
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
            cc.replay.getPracticeInformation({
                success: function (res) {
                    console.log("getPracticeInformation success", res.datas);
                    console.log("getPracticeInformation info", JSON.stringify(res))
                    self.setData({
                        info: JSON.stringify(res)
                    })
                },
                fail: function (error) {
                    console.log("getPracticeInformation fail", error);
                }
            });
        }
    },

    ready: function () {

    }
});
