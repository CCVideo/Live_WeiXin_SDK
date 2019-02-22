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
        var chatTimer = 0;
        var cacheMsgs = [];
        cc.replay.on("chat_msg_sync", function (data) {
            cacheMsgs = cacheMsgs.concat(data);

            if (data.length >= 10) {
                clearTimeout(chatTimer);
                //聊天间隔频率最小是1秒，如果1秒内发送2条聊天信息，第二次无效。
                //chat_msg_sync 事件返回聊天信息最小频率是0.5秒，如果快进，可能一下返回n条聊天信息，n条聊天信息会以500ms每次最大10条一组返回。
                //加900延迟，是为了如果快进，之渲染最后20条，而不是之前所有聊天信息都渲染一遍，消耗性能，造成卡顿。
                chatTimer = setTimeout(function () {
                    showChatMsgs(cacheMsgs);
                }, 900);
                return;
            }
            clearTimeout(chatTimer);

            showChatMsgs(cacheMsgs);
        });

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

            chatMsgs = chatMsgs.splice(-20, 20);
            srollChatMsgList(chatMsgs);
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
