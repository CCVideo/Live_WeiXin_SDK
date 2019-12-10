var cc = getApp().globalData.ccsdk;

// components/live/punch.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    punchId: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    startPunch(punchId, datas) {
      var self = this;
      wx.showModal({
        title: "开始打卡",
        showCancel: false,
        content: JSON.stringify(datas),
        success(res) {
          if (res.confirm) {
            console.log("确定打卡");
            self.commitPunch(punchId);
          }
        }
      });
    },
    commitPunch(punchId) {
      cc.live.commitPunch({
        punchId: punchId,
        success(datas) {
          console.log("commitPunch success", datas);
        },
        fail(datas) {
          console.log("commitPunch fail", datas);
        }
      });
    },
    getViewerPunch() {
      var self = this;
      cc.live.on("start_punch", (datas) => {
        console.log("start_punch", datas);
        const _datas = JSON.parse(datas);
        const punchId = _datas.punchId;
        if (!punchId) {
          return false;
        }
        self.startPunch(punchId, datas);
      });
      cc.live.viewerPunch({
        success(datas) {
          console.log("viewerPunch success", datas);
          if (datas && datas.data && datas.data.isExists) {
            const punchId = datas.data.punch.id;
            self.startPunch(punchId, datas);
          }
        },
        fail(datas) {
          console.log("viewerPunch fail", datas);
        }
      });
    }
  },

  ready() {
    this.getViewerPunch();
    cc.live.on("stop_punch", (datas) => {
      console.log("stop_punch", datas);
      wx.showModal({
        title: "结束打卡",
        content: datas,
        showCancel: false,
        success(res) {
          if (res.confirm) {
            console.log("确定打卡");
          }
        }
      });
    });
  }
});
