// pages/headlineNews/detail/index.js
import $ from '../../../utils/http'
var WxParse = require('../../../wxParse/wxParse.js');
//获取应用实例
const app = getApp()
let url = app.globalData.httpUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nodes: [{
      name: 'img',
      article:'',
      attrs:{
        class:'img',
        style:'width:100%'
      }
    }],
    // nodes:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    let Id = options.Id
    wx.setNavigationBarTitle({
      title: options.title
    })
    let _that =this
    // 请求头条详情数据
    wx.request({
      url: url + '/WebApi/GetNewsById?Id=' + Id,
      method:'post',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        wx.hideLoading()
        // let article_content = res.data.Data.Contents
        var article = res.data.Data.Contents;
        // console.log(article)
        /**
        * WxParse.wxParse(bindName , type, data, target,imagePadding)
        * 1.bindName绑定的数据名(必填)
        * 2.type可以为html或者md(必填)
        * 3.data为传入的具体数据(必填)
        * 4.target为Page对象,一般为this(必填)
        * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
        */
        var that = this;
        WxParse.wxParse('article', 'html', article, _that, 5);
        // let article_content = res.data.Data.Contents
        // article_content = article_content.replace(/<img/gi, '<img style="width:100%;height:auto;float:left;display:block" ')
     		// 						 	.replace(/<section/g, '<div')
        //                .replace(/\/section>/g, '\div>');
        // console.log(article_content)
        // _that.setData({
        //   nodes:article_content
        // })
      },
      fail: (res) => {
        wx.hideLoading()
        wx.showToast({
          title: '网络异常，请稍后重试~',
          icon: 'none',
          duration: 2000
        })
      }
    })
        // // 请求数据
        // $.ajax({
        //   url:'/WebApi/GetNewsById?Id=' + Id,
        //   method:'post'
        // }).then((res) => {
        //   _that.setData({
        //     nodes:res.Data.Contents
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