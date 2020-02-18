// pages/reservationService/index.js
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
    lists:{},
    date: '',
    week:'', //传给详情页
    navIndex: 1,
    noDatatext:''
  },
  // 点击进入详情页
  itemTap(e) {
    if(!wx.getStorageSync('openid') || !wx.getStorageSync('isRegister')) {
      util.showToast('请先注册噢~')
      setTimeout(() =>{
        wx.switchTab({
          url: '/pages/personalCenter/index' //登录页面
        })
      },2500)
      return
    }
    let id = e.detail.Id
    wx.navigateTo({
      url: "/pages/reservationService/detailPage/index?Id=" + id +"&week=" + this.data.week+"&day=" + this.data.date +  '&title=' + e.detail.title
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  // 监听日历返回的数据并作处理
  dayTap(e) {
    let day = e.detail.day
    let _that=this
    let  noDatatext = ''
    console.log("点击的时间是：" + day)
      // 请求数据
      if(!wx.getStorageSync('openid') || !wx.getStorageSync('isRegister')) {
        wx.showLoading({
          title: '加载中',
        })
      wx.request({
        url: url + '/WebApi/GetAllRooms',
        method:'post',
        data:{
          date:util.formatTime(day),
          Type:this.data.navIndex ,//Type = 1 ? "党群中心" : "品牌项目",
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success (res) {
          // console.log(res)
          wx.hideLoading()
          let data = res.data.Data
        if(data.length === 0) {
          noDatatext='暂时没有数据噢~'
        }
          _that.setData({
            lists:data,
            date:util.formatTime(day),
            week:day.getDay(),
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
      return
    }
      $.ajax({
        url:'/WebApi/GetAllRooms',
        method:'post',
        data:{
          date:util.formatTime(day),
          Type:this.data.navIndex ,//Type = 1 ? "党群中心" : "品牌项目",
        }
      }).then((res) => {
        console.log(res.Data)
        let data = res.Data
        if(data.length === 0) {
          noDatatext='暂时没有数据噢~'
        }
        _that.setData({
          lists:data,
          date:util.formatTime(day),
          week:day.getDay(),
          noDatatext:noDatatext
        })
      })
  },
  // 监听导航组件返回的数据并作处理
  navTap(e) {
    let _that=this
    let navIndex = e.detail.navIndex
    // console.log("点击的导航下标是：" + this.data.navIndex)
    if(navIndex ===0) {
      // 请求数据
      if(!wx.getStorageSync('openid') || !wx.getStorageSync
      ('isRegister')) {
        wx.showLoading({
          title: '加载中',
        })
      wx.request({
        url: url + '/WebApi/GetAllRooms',
        method:'post',
        data:{
          date:_that.data.date,
          Type:1,//Type = 1 ? "党群中心" : "品牌项目",
          
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success (res) {
          console.log(res)
          wx.hideLoading()
          _that.setData({
            lists:res.data.Data,
            navIndex: 1
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
      return
    }
      $.ajax({
        url:'/WebApi/GetAllRooms',
        method:'post',
        data:{
          date:_that.data.date,
          Type:1,//Type = 1 ? "党群中心" : "品牌项目",
          
        }
      }).then((res) => {
        _that.setData({
          lists:res.Data,
          navIndex: 1
        })
      })
    }
    if(navIndex ===1) {
      // 请求数据
      if(!wx.getStorageSync('openid') || !wx.getStorageSync('isRegister')) {
        wx.showLoading({
          title: '加载中',
        })
      wx.request({
        url: url + '/WebApi/GetAllRooms',
        method:'post',
        data:{
          date:_that.data.date,
          Type:2,//Type = 1 ? "党群中心" : "品牌项目",
          
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success (res) {
          console.log(res)
          wx.hideLoading()
          _that.setData({
            lists:res.data.Data,
            navIndex: 2
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
    $.ajax({
      url:'/WebApi/GetAllRooms',
      method:'post',
      data:{
        date:_that.data.date,
        Type:2 //Type = 1 ? "党群中心" : "品牌项目",
      }
    }).then((res) => {
      console.log(res.Data)
      _that.setData({
        lists:res.Data,
        navIndex: 2
      })
    })
    }
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
    this._ajaxData()
  },
  _ajaxData() {
      // 给日历组件传数据
    let date = new Date();
    console.log(date)
    this.selectComponent('#calendar').init(date);
    let noDatatext = ''
    let _that =this
    // 请求数据
    if(!wx.getStorageSync('openid') || !wx.getStorageSync('isRegister')) {
      wx.showLoading({
        title: '加载中',
      })
    wx.request({
      url: url + '/WebApi/GetAllRooms',
      method:'post',
      data:{
        date:util.formatTime(date),
        Type:_that.data.navIndex //Type = 1 ? "党群中心" : "品牌项目",
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res)
        let data = res.data.Data
        if(data.length === 0) {
          noDatatext='暂时没有数据噢~'
        }
        wx.hideLoading()
        _that.setData({
          lists:data,
          date:util.formatTime(date),
          week:date.getDay(),
          navIndex: _that.data.navIndex,
          noDatatext:noDatatext
        })
      }
    })
  return}
    $.ajax({
      url:'/WebApi/GetAllRooms',
      method:'post',
      data:{
        date:util.formatTime(date),
        Type:this.data.navIndex //Type = 1 ? "党群中心" : "品牌项目",
      }
    }).then((res) => {
      console.log(res.Data)
      let data = res.Data
        if(data.length === 0) {
          noDatatext='暂时没有数据噢~'
        }
      _that.setData({
        lists:data,
        date:util.formatTime(date),
        week:date.getDay(),
        navIndex: this.data.navIndex,
        noDatatext:noDatatext
      })
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