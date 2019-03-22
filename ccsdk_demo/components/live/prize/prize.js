// components/live/prize.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        prizeDate: {
            type: Object,
            value: "",
            observer(newVal) {
                if (newVal) {
                    this.showPrize();
                }
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        toggle: "none"
    },

    /**
     * 组件的方法列表
     */
    methods: {
        showPrize() {
            this.setData({
                toggle: "flex"
            });
            setTimeout(() => {
                this.setData({
                    toggle: "none"
                });

                console.log(this);

                this.hidePrize();
            }, 2500);
        },
        hidePrize() {
            this.triggerEvent("hideprize",{},{});
        }
    }
});
