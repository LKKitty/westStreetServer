// pages/wishCollection/index.js
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
    description:'字符字符字符字符字符字符字符字符字符字符字符字符字符字符字符字符字符字符字符字符字符字符字符字符字符字符字符字符字符字符字符字符字符字符字符字符字符字符字符字符字符字',//描述
    wishLists: [],
    noDatatext:''
  },
  wishDetail (e) {
    if(!wx.getStorageSync('openid') || !wx.getStorageSync('isRegister')) {
      util.showToast('请先注册噢~')
      setTimeout(() =>{
        wx.switchTab({
          url: '/pages/personalCenter/index' //登录页面
        })
      },2500)
      return
    }
    let id = e.currentTarget.dataset.id
    let type = e.currentTarget.dataset.type
    let title = e.currentTarget.dataset.title
    console.log(e)
    wx.navigateTo({
      url: './detailPage/index?Id=' + id + '&type=' + type+ '&title=' + title
    })
  },
  addWish () {
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
      url: './releasePage/index'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._ajaxData()
  },
  _ajaxData() {
    let _that =this
    wx.showLoading({
      title: '加载中',
    })
    // 请求数据
    wx.request({
      url: url + '/WebApi/GetAllWish',
      method:'post',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res)
        let noDatatext = ''
        wx.hideLoading()
        let data = res.data.Data.reverse()
        if(data.length ===0) {
          noDatatext='暂时没有心愿项目~'
        }
      console.log(data)
      for(let i=0;i<data.length;i++) {
        data[i].Imgs = data[i].Imgs || '' 
        data[i].Imgs = data[i].Imgs.split(',')
      }
      _that.setData({
        wishLists:data,
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
    // $.ajax({
    //   url:'/WebApi/GetAllWish',
    //   method:'post',
    // }).then((res) => {
    //   let data = res.Data
    //   console.log(data)
    //   for(let i=0;i<data.length;i++) {
    //     data[i].Imgs = data[i].Imgs.split(',')
    //   }
    //   _that.setData({
    //     wishLists:data 
    //   })
    // })
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