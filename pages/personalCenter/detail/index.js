// pages/personalCenter/detail/index.js
import $ from '../../../utils/http'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getDataUrl: '', //请求数据地址
    getDataUrl2:'', //我发布的心愿请求数据地址
    wishType:0,//0我领取的心愿 1我发布的心愿
    type:'', //类型
    lists:[], //item数据
    isRegister:false, //是否注册
    navNames:['我领取的','我发布的'], //我的心愿导航栏
    isTip: false, //是否显示弹窗
    tip:{
      imgUrl:'/images/tipfal.png',
      status:2,
      msg: '确认取消吗?',
      showCanel: true
    },
    canelDataUrl:'', //删除请求的接口
    canelId: '', //删除的id
    operatType: '', //item返回的操作类型,
    noDataText: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let type = options.type
    this.setData({
      type:type,
      isRegister: wx.getStorageSync('isRegister') //是否注册
    })
    if(type === 'activity') {
      this.setData({
        getDataUrl:'GetActivity',
        canelDataUrl: 'ExitActivity?ActivityId=' 
      })
    }
    if(type === 'wish') {
      this.setData({
        getDataUrl:'GetMyWish' ,// 我领取的心愿
        getDataUrl2: 'GetPushWish' ,//我发布的心愿
      })
    }
    if(type === 'reservation') {
      this.setData({
        getDataUrl:'GetServiceRooms',
        canelDataUrl: 'ExitService?RoomsId=' 
      })
    }
    // 请求数据
    $.ajax({
      url:'/WebApi/' + this.data.getDataUrl,
      method:'post'
    }).then((res) => {
      console.log(res)
      let data = res.Data
      let noDataText = ''
      if(data.length === 0) {
        noDataText = '暂无数据~'
      }
    this.setData({
      lists:data,
      noDataText:noDataText
    })
    })
  },
  //我的心愿，监听导航栏切换
  navTap(e) {
    let _that=this
    let navId = e.detail.navIndex
    console.log(_that.data.getDataUrl)
    if(navId === 0) {
       // 请求数据
    $.ajax({
      url:'/WebApi/' + _that.data.getDataUrl,
      method:'get'
    }).then((res) => {
      console.log(res)
      _that.setData({
      lists:res.Data,
      wishType: navId
    })
    })
    }
    if(navId === 1) {
        // 请求数据(我发布的心愿)
    $.ajax({
      url:'/WebApi/' + _that.data.getDataUrl2,
      method:'get'
    }).then((res) => {
      console.log(res)
      _that.setData({
        lists:res.Data,
        wishType: navId
      })
    })
    }
  },
  // 监听组件点击做处理
  itemTap(e) {
    console.log(e)
    let itemId = e.detail.Id
    let day = e.detail.date
    let week = e.detail.week
    let title = e.detail.title
    this._onItrem(itemId,day,week,title)
  },
  // 监听按钮操作
  operatTap(e) {
    let text = '预约'
    if(this.data.type === 'activity') {
      text = '报名'
    }
    let canelId = e.detail.operatId  //取消Id
    let itemId = e.detail.itemId //详情Id
    let day = e.detail.date  //预约时间
    let week = e.detail.week //预约星期
    let operatType = e.detail.operatType
    let operatTitle = e.detail.operatTitle
    if(operatType. indexOf('取消')!= -1) {
      this.setData({
        tip:{
          imgUrl:'/images/tipCanel.png',
          status:2,
          msg: '确认取消'+text+'吗?',
          showCanel: true
        },
        isTip:!this.data.isTip,
        canelId: canelId,
        operatType:operatType
      })
    }else {
      this._onItrem(itemId,day,week,operatTitle)
    }
  },
  // 监听弹窗点击确认或取消(0确认，1取消)
  tipTap(e) {
    let _that = this
    let status = e.detail.status
    let lists = _that.data.lists
    let listsIndex = 0
    // 点击确认
    if(status == 0) {
      // wx.showLoading({
      //   title: '正在删除',
      // })
        $.ajax({
        url:'/WebApi/' + _that.data.canelDataUrl + _that.data.canelId ,
        method:'post',
      }).then((res) => {
        // wx.showToast({
        //   title: res.Message,
        //   icon: 'none',
        //   duration: 2000
        // })
        
        if(res.ResultCode === 1000) {
          for(let i=0;i<lists.length;i++) {
            if(lists[i].ActivityId === _that.data.canelId || lists[i].RoomsId === _that.data.canelId) {
              listsIndex = i 
              // console.log('删除下标',i)
            }
          }
          lists.splice(listsIndex,1) //删除取消的那一项
          // 更新数据
          _that.setData({
            lists:lists,
            isTip:!_that.data.isTip
          })
          // wx.hideLoading()
          wx.showToast({
            title: '取消成功',
            icon: 'none',
            duration: 2000
          })
          // $.ajax({
          //   url:'/WebApi/' + _that.data.getDataUrl,
          //   method:'post'
          // }).then((res) => {
          //   console.log(res)
          //   wx.hideLoading()
          //   wx.showToast({
          //     title: '取消成功',
          //     icon: 'none',
          //     duration: 2000
          //   })
          // _that.setData({
          //   lists:res.Data,
          //   isTip:!_that.data.isTip
          // })
          // })
        } else {
          wx.showToast({
            title: res.Message,
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
    // 点击取消
    if(status == 1) {
      _that.setData({
          isTip:!_that.data.isTip
        })
      console.log('不做操作')
    }
    console.log(status)
  },
  _onItrem(itemId,day,week,title) {
    console.log('itemId' , itemId,week)
    let url = ''
    if(this.data.type === 'activity') {
      url='/pages/activitySign/detail/index?Id=' + parseInt(itemId) + '&title=' +title
    }
    if(this.data.type === 'reservation') {
      url='/pages/reservationService/detailPage/index?Id=' + parseInt(itemId)  +'&day=' + day + '&week' + parseInt(week) + '&title=' +title
    }
    if(this.data.type === 'wish') {
      url='/pages/wishCollection/detailPage/index?Id='+ parseInt(itemId)+ '&title=' +title
    }
    // 跳转详情
    wx.navigateTo({
      url: url
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