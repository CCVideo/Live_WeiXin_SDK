var cc = getApp().globalData.ccsdk;
// components/replay/chat/chat.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        groupid: {
            type: String,
            value: 0
        },
        viewerid: {
            type: String,
            value: 0
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        //聊天信息 格式：{name: 'name', msg: 'msg'}
        chatMsg: [],
        toggleChatScroll: true,
        chatMsgMax: -50,
        chatMsgLength: 0,
        toChatMsg: ""
    },

    /**
     * 组件的方法列表
     */
    methods: {
        //允许聊天内容自动滑动
        _bindChatScrollTolower: function (e) {
            this.setData({
                toggleChatScroll: true
            });
        },
        //禁止聊天内容自动滑动
        _bindChatScroll: function (e) {
            var height = e.detail.scrollHeight;
            var top = e.detail.scrollTop;
            if (height - top > 400) {
                this.setData({
                    toggleChatScroll: false
                });
            }
        },
        isWithGroup: function (data) {
            var self = this;
            var groupId = data.groupId;
            if (!groupId) {
                return true;
            }

            var role = "";

            if (data.userrole) {
                role = data.userrole;
            } else if (data.userRole) {
                role = data.userRole;
            } else if (data.fromuserrole) {
                role = data.fromuserrole;
            } else if (data.answerUserRole) {
                role = data.answerUserRole;
            } else if (data.fromuserrole) {
                role = data.fromuserrole;
            } else if (data.role) {
                role = data.role;
            }

            if (role && role === "publisher") {
                return true;
            }

            if (self.data.groupid && self.data.groupid !== groupId) {
                return false;
            }
            return true;
        },
    },

    ready: function () {
        var self = this;
        var chatMsgs = [];
        cc.replay.on("chat_msg_sync", function (data) {
            showChatMsgs(data);
            // cc.replay.deleteEvent("chat_msg_sync");
        });

        // 节流函数，提高聊天渲染性能
        var throttle = (function() {
            var timer = 0
            return function(callback, interval) {
                if (!timer) {
                    timer = setTimeout(function(){
                        callback && callback()
                        timer = 0
                    }, interval)
                }
            }
        })()

        function showChatMsgs(data) {
            for (var i = 0; i < data.length; i++) {
                if (!self.isWithGroup(data[i])) {
                    continue;
                }
                var CMS = {};
                CMS.name = data[i].username;
                CMS.userid = data[i].userid;
                CMS.status = data[i].status;
                if (CMS.userid === self.data.viewerid) {
                    CMS.status = 0;
                }
                CMS.msg = cc.replay.showEm(data[i].msg);
                chatMsgs.push(CMS);
            }

            // 增加节流函数，防止大量聊天时页面卡死
            throttle(function() {
                chatMsgs = chatMsgs.slice(self.chatMsgMax);
                srollChatMsgList(chatMsgs);
            }, 1000)
        }

        function srollChatMsgList(chatMsg) {
            self.setData({
                chatMsg: chatMsg,
                chatMsgLength: chatMsg.length
            });

            if (self.data.toggleChatScroll) {
                self.setData({
                    toChatMsg: "lastChat"
                });
            }
        }
    }
});
