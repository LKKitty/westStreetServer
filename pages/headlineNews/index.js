// pages/headlineNews/index.js
import $ from '../../utils/http'
import util from '../../utils/util'
//获取应用实例
const app = getApp()
let url = app.globalData.httpUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists:[],
    noDatatext:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    wx.showLoading({
      title: '加载中',
    })
    let _that =this
        // 请求头条列表数据
    wx.request({
      url: url + '/WebApi/GetAllNews',
      method:'post',
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
        let lists = data
          for(let i=0;i<lists.length;i++) {
            let time = util.formatTime(util.subDate(lists[i].AddTime),true).split('&')
            lists[i].AddTime=time[0]
          }
          _that.setData({
            lists:lists,
            noDatatext:noDatatext
          })
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
        // $.ajax({
        //   url:'/WebApi/GetAllNews',
        //   method:'post'
        // }).then((res) => {
        //   console.log(res)
        //   let lists = res.Data
        //   for(let i=0;i<lists.length;i++) {
        //     let time = util.formatTime(util.subDate(lists[i].AddTime),true).split('&')
        //     lists[i].AddTime=time[0]
        //   }
        //   _that.setData({
        //     lists:lists
        //   })
        // })
  },
  onDetail(e) {
    let Id = e.currentTarget.dataset.id
    let title = e.currentTarget.dataset.title
    console.log(e)
    // 跳转详情
    wx.navigateTo({
      url: '/pages/headlineNews/detail/index?Id=' + Id + '&title=' + title
    })
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