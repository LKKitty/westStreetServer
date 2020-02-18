// pages/activitySign/index.js
import $ from '../../utils/http'
import util from "../../utils/util"
//获取应用实例
const app = getApp()
let url = app.globalData.httpUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['党建', '培训', '亲子', '阅览','舞蹈','运动'],
    arrayIndex: 0,
    lists:[],
    noDatatext:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this._ajaxData(this.data.arrayIndex)
  },
  bindPickerChange: function(e) {
    let index = e.detail.value
    this._ajaxData(index)
    this.setData({
      arrayIndex: index
    })
  },
  // 点击列表
  itemTap(e) {
    let id = e.detail.Id
    if(!wx.getStorageSync('openid') || !wx.getStorageSync('isRegister')) {
      util.showToast('请先注册噢~')
      setTimeout(() =>{
        wx.switchTab({
          url: '/pages/personalCenter/index' //登录页面
        })
      },2500)
      return
    }
    wx.navigateTo({
      url: "/pages/activitySign/detail/index?Id=" + id + '&title=' + e.detail.title
    })
  },
  _ajaxData(type) {
    let _that =this
    if(!wx.getStorageSync('openid') || !wx.getStorageSync('isRegister')) {
      wx.showLoading({
        title: '加载中',
      })
    wx.request({
      url: url + '/WebApi/GetAllActivity',
      method:'post',
      data:{
        Type:parseInt(type)+ 1 //Type 1-6
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res)
        let data = res.data.Data
        let noDatatext =''
        if(data.length ===0) {
          noDatatext ='暂无数据噢~'
        }
        wx.hideLoading()
        _that.setData({
          lists:data,
          noDatatext:noDatatext
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
    return}
    // 请求数据
    $.ajax({
      url:'/WebApi/GetAllActivity',
      method:'post',
      data:{
        Type:parseInt(type)+ 1 //Type 1-6
      }
    }).then((res) => {
      console.log(res.Data)
      let data = res.Data
      let noDatatext =''
        if(data.length ===0) {
        noDatatext ='暂无数据噢~'
      }
      _that.setData({
        lists:data,
        noDatatext:noDatatext
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this._ajaxData(this.data.arrayIndex)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return getApp().globalData.shareMessage
  }
})