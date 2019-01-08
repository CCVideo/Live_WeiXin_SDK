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
        toChatMsg: ''
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

            var role = '';

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

            if (role && role === 'publisher') {
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
        cc.replay.on('chat_msg_sync', function (data) {
            var data = data;
            for (var i = 0; i < data.length; i++) {
                if (!self.isWithGroup(data[i])) {
                    continue;
                }
                var CMS = {};
                CMS.name = data[i].username;
                CMS.msg = cc.replay.showEm(data[i].msg);
                chatMsgs.push(CMS);
            }

            chatMsgs = chatMsgs.splice(-30, 30);
            srollChatMsgList(chatMsgs);
        });

        function srollChatMsgList(chatMsg) {
            self.setData({
                chatMsg: chatMsg,
                chatMsgLength: chatMsg.length
            });

            if (self.data.toggleChatScroll) {
                self.setData({
                    toChatMsg: 'lastChat'
                });
            }
        }
    }
});
