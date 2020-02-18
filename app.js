//app.js
import util from './utils/util.js'
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    const version = wx.getSystemInfoSync().SDKVersion
    wx.showShareMenu({
      withShareTicket: true
    })
    if (util.compareVersion(version, '2.3.2') >= 0) {
      // wx.openBluetoothAdapter()
      return true
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，某些功能会无法使用，请升级到最新微信版本后重试。'
      })
    }
  },
  globalData: {
    userInfo: null,
    httpUrl: 'https://test15.iwesalt.com',//请求地址,
    shareMessage: {
      title: '西区云服务',
      path: '/page/index/index',
      imageUrl: '/images/bannerIndex.png'
    }
  }
})