// components/replay/player/swiper.js
Component({
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    /**
     * 组件的属性列表
     */
    properties: {
        initData: {
            type: Array,
            value: []
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        tabOptionSelected:0
    },

    /**
     * 组件的方法列表
     */
    methods: {
        _bindTab:function(e){
            var index = e.currentTarget.dataset.index;
            this.setData({
                tabOptionSelected: index
            });
        },
        //选中样式
        _bindSwiperChange: function(e) {
            if (e.detail.source === 'touch') {
                var index = e.detail.current;
                this.setData({
                    tabOptionSelected: index
                });
            }
        }
    },

    ready: function () {
    }
});
