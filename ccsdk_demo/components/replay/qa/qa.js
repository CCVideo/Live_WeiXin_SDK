// components/replay/qa/qa.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        initData: {
            type: Object,
            value: {},
            observer: '_configQaData'
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        questions: [],
        answers: [],
        //问答信息 格式 { name: 'name', time: '00:00', question: 'question',encryptId:'encryptId', display:false answers: [{ name: 'name', answer: 'answer',isPrivate:0 }]}
        qaData: [],
    },

    /**
     * 组件的方法列表
     */
    methods: {
        _configQaData: function (newVal) {
            if (JSON.stringify(newVal) === '{}') {
                return;
            }
            var self = this;
            this.setData({
                questions: newVal.questions_info,
                answers: newVal.answers_info
            });

            var qaData = [];
            var questions = this.data.questions;
            var answers = this.data.answers;
            for (var i = 0; i < questions.length; i++) {
                questionCache(questions[i]);
            }
            for (var j = 0; j < answers.length; j++) {
                answerCache(answers[j]);
            }

            function questionCache(data) {
                var data = data;
                var qObj = {};
                qObj.name = data.value.userName;
                qObj.time = self._formatSeconds(data.value.time);
                qObj.question = data.value.content;
                qObj.answers = [];
                if (data.value.isPublish === 1) {
                    qObj.display = true;
                } else {
                    qObj.display = false;
                }
                qObj.encryptId = data.value.id;
                qaData.push(qObj);
            }

            function answerCache(data) {
                var data = data;
                var arr = qaData;
                var aObj = {};
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].encryptId == data.value.questionId) {
                        aObj.name = data.value.userName;
                        aObj.answer = data.value.content;
                        aObj.isPrivate = data.value.isPrivate;
                        arr[i].answers.push(aObj);
                        break;
                    }
                }
            }

            this.setData({
                qaData: qaData
            });
        },
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
        }
    },

    ready: function () {

    }
});
