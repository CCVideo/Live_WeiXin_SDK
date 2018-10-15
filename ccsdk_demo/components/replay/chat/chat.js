var cc = getApp().globalData.ccsdk;
// components/replay/chat/chat.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {},

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
    },

    ready: function () {
        var self = this;
        var chatMsg = [];
        cc.replay.on('chat_msg_sync', function (data) {
            var data = data;
            for (var i = 0; i < data.length; i++) {
                var cm = {};
                cm.name = data[i].username;
                cm.msg = data[i].msg;
                chatMsg.push(cm);
            }
            srollChatMsgList();
        });

        function srollChatMsgList() {
            self.setData({
                chatMsg: chatMsg,
                chatMsgLength: self.data.chatMsg.length
            });
            if (self.data.toggleChatScroll) {
                self.setData({
                    toChatMsg: 'lastChat'
                });
            }
        }
    }
});
