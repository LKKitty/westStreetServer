//index.js
import {showToast,isminutes} from '../../utils/util'
//获取应用实例
const app = getApp()
let url = app.globalData.httpUrl

Page({
  data: {
    newList:[],
    activity:[]
  },
  //事件处理函数
  bindViewTap: function(e) {
    let tabUrl = e.currentTarget.dataset.url
    wx.navigateTo({
      url: tabUrl
    })
  },
  newslist: function() {
    wx.navigateTo({
      url: '/pages/headlineNews/index'
    })
  },
  activityDetail: function(e) {
    if(!wx.getStorageSync('openid') || !wx.getStorageSync('isRegister')) {
      showToast('请先注册噢~')
      setTimeout(() =>{
        wx.switchTab({
          url: '/pages/personalCenter/index' //登录页面
        })
      },2500)
      return
    }
    let id = e.currentTarget.dataset.id
    let title = e.currentTarget.dataset.title
    wx.navigateTo({
      url: '/pages/activitySign/detail/index?Id=' + id +'&title=' + title
    })
  },
  onLoad: function () {
    let _that=this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: url + '/WebApi/GetActivityforIndex',
      method:'post',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res)
        wx.hideLoading()
        _that.setData({
          activity:res.data.Data.reverse()
        })
      },
      fail:(res) =>{
        wx.hideLoading()
        wx.showToast({
          title: '网络异常，请稍后重试~',
          icon: 'none',
          duration: 2000
        })
      }
    })
    // 请求头条数据
    wx.request({
      url: url + '/WebApi/GetNewsforIndex',
      method:'post',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res)
        wx.hideLoading()
        _that.setData({
          newList:res.data.Data.reverse()
        })
      },
      fail:(res) =>{
        wx.hideLoading()
        wx.showToast({
          title: '网络异常，请稍后重试~',
          icon: 'none',
          duration: 2000
        })
      }
    })
    
  },
  _onlogin() {
    
  },
  onShow:function () {
    
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return getApp().globalData.shareMessage
  }
})
