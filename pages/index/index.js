let context = null;
var isButtonDown = false;
var arrx = [];
var arry = [];
var arrz = [];

Page({
  /**
   * 页面的初始数据
   */
  data: {
    canvasWidth: 0,
    canvasHeight: 0,
    imgUrl: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.getSystemInfo({
      success(res) {
        that.setData({
          canvasWidth: res.windowWidth,
          canvasHeight: res.windowHeight / 2 - 100
        })
      }
    })

    // 使用 wx.createContext 获取绘图上下文 context
    context = wx.createCanvasContext('canvas');

  },
  canvasIdErrorCallback: function(e) {
    console.log(e.detail.errMsg)
  },
  canvasStart: function(event) {
    // console.log(event)
    isButtonDown = true;
    arrz.push(0);
    arrx.push(event.changedTouches[0].x);
    arry.push(event.changedTouches[0].y);
  },
  canvasMove: function(event) {
    // console.log(event)
    if (isButtonDown) {
      arrz.push(1);
      arrx.push(event.changedTouches[0].x);
      arry.push(event.changedTouches[0].y);
    };

    for (let i = 0; i < arrx.length; i++) {
      if (arrz[i] == 0) {
        context.moveTo(arrx[i], arry[i])
      } else {
        context.lineTo(arrx[i], arry[i])
      }
    }

    context.clearRect(0, 0, this.data.canvasWidth, this.data.canvasHeight);
    context.setStrokeStyle('#000000');
    context.setLineWidth(4);
    context.setLineCap('round');
    context.setLineJoin('round');
    context.stroke();
    context.draw(false);
  },
  canvasEnd: function(e) {
    isButtonDown = false;
  },
  cleardraw: function(e) {
    arrx = [];
    arry = [];
    arrz = [];
    context.clearRect(0, 0, this.data.canvasWidth, this.data.canvasHeight);
    context.draw(true);
  },
  getImg: function() {
    if (arrx.length == 0) {
      wx.showModal({
        title: '提示',
        content: '签名内容不能为空！',
        showCancel: false
      });
      return;
    }
    // 生成图片
    var that = this
    wx.canvasToTempFilePath({
      canvasId: 'canvas',
      success: function(res) {
        // console.log(res.tempFilePath)
        that.setData({
          imgUrl: res.tempFilePath
        })
      }
    }, this)
  },
})