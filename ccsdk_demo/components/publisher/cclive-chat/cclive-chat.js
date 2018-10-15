/*
  聊天展示demo，供用户参考学习使用。暂无实际应用
*/

var cc = getApp().globalData.ccsdk;

Component({
    //组件的属性列表
    properties: {
        ccheight: {
            type: String,
            value: '120px'
        },
        ccusernameColor: {
            type: String,
            value: 'rgb(232, 178, 31)'
        },
        ccmsgColor: {
            type: String,
            value: 'white'
        },
        ccfontSize: {
            type: String,
            value: '16px'
        }

    },
    //组件的初始数据
    data: {
        msg: [],
        scrollTop: 0,
        scrollSwitch: true

    },
    //组件的方法列表
    methods: {
        touchstart: function () {
            this.setData({
                scrollSwitch: false
            });
        },
        scrolltolower: function () {
            this.setData({
                scrollSwitch: true
            });
        }
    },
    ready: function () {
        var that = this;

        var arr = [];
        var index = 0;

        cc.publisher.on('chat_message', function (e) {

            addMsg(e);

        });

        cc.publisher.on('private_chat', function (e) {

            addMsg(e);

        });

        var addMsg = function (e) {
            var data = JSON.parse(e);

            data.msg = cc.publisher.showEm(data.msg);

            arr.push(data);

            that.setData({
                msg: arr
            });

            wx.createSelectorQuery().selectAll('.cclive-chat >>> .chats').boundingClientRect(function (rects) {

                if (rects.length > 0) {
                    index = 0;
                    rects.forEach(function (rect) {
                        index += rect.height + 16;
                    });
                    if (that.data.scrollSwitch) {
                        that.setData({
                            scrollTop: index
                        });
                    }
                } else {
                    index++;
                    if (that.data.scrollSwitch) {
                        that.setData({
                            scrollTop: index * parseInt(that.properties.ccheight)
                        });
                    }
                }

            }).exec();
        };

    }

});
