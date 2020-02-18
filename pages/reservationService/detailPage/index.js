// pages/reservationService/detailPage/index.js
import $ from '../../../utils/http'
import util from "../../../utils/util"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isRepeat: true, //是否可以点击提交
    imgUrls: '',
    RoomsId:'',
    data:{},
    date:'',
    week:'',
    STime:'',
    ETime:'',
    isGet: 0, //0未预约 1已预约
    navNames:[
      '内容一览','功能详情','使用须知'
    ],
    indexId: 0,
    click: false, //是否显示弹窗内容
    option: false, //显示弹窗或关闭弹窗的操作动画\
    isTip:false, //是否显示tip
    tips:{
      imgUrl: '/images/tip1.png',
      status: 0,
      msg: '您已登录成功啦！',
      showCanel: false,
    }
  },
  navTap(e) {
    let navIndex = e.detail.navIndex
    console.log(navIndex)
    this.setData({
      indexId: navIndex
    })
  },
  onTip(e) {
    let _that=this
    let status = e.detail.status
    if(status === "0") {
      if(this.data.tips.msg.indexOf('成功') !== -1) {
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
      _that.setData({
        isTip:!_that.data.isTip,
      })
    }
    console.log(e)
  },
 // 用户点击显示日期选择弹窗
clickPup: function() {
  let _that = this;
   // 已报名则不弹窗
  if(_that.data.isGet===1) {
    util.showToast('您已预约')
    return
  }
  if (!_that.data.click) {
    _that.setData({
      click: true,
    })
  }

  if (_that.data.option) {
    _that.setData({
      option: false,
    })
    // 关闭显示弹窗动画的内容，不设置的话会出现：点击任何地方都会出现弹窗，就不是指定位置点击出现弹窗了
    setTimeout(() => {
      _that.setData({
        click: false,
      })
    }, 500)


  } else {
    _that.setData({
      option: true
    })
  }
},
boxTap() {
  return
},
submit() {
  let _that=this
  if(this.data.STime==='' ) {
    util.showToast('开始时间不能为空')
    return
  }
  if(this.data.ETime==='' ) {
    util.showToast('结束时间不能为空')
    return
  }
  if(this.data.ETime<this.data.STime ) {
    util.showToast('结束时间不能小于开始时间')
    return
  }
  if(this.data.isRepeat) {
    _that.setData({
      isRepeat:!_that.data.isRepeat
    })
  // 请求数据
  $.ajax({
    url:'/WebApi/AddService',
    method:'post',
    data:{
      RoomsId:_that.data.RoomsId,
      Date:_that.data.date,
      STime:_that.data.STime,
      ETime:_that.data.ETime,
    }
  }).then((res) => {
    _that.setData({
      isRepeat:!_that.data.isRepeat
    })
    let data = res
    console.log(data)
    if(data.ResultCode == 1000) {
      console.log(data.ResultCode)
      _that.setData({
        isTip:!_that.data.isTip,
        tips:{
          imgUrl: '/images/tipSuc.png',
          status: 2,
          msg: '预约成功',
          showCanel: false,
        }
      })
    } else {
      console.log(data.ResultCode)
      _that.setData({
        isTip:!_that.data.isTip,
        tips:{
          imgUrl: '/images/tipfal.png',
          status: 2,
          msg: data.Message,
          showCanel: false,
        }
      })
    }
  })}else{return}
  // console.log('提交成功')
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.day)
    let _that=this
    let id=options.Id
    let day =this._day(options.day)
    let week =this._week(options.week)
    // 设置标题
    wx.setNavigationBarTitle({
      title: options.title
    })
    console.log(day,options.week)
    // 请求数据
    $.ajax({
      url:'/WebApi/GetRoomsById',
      method:'post',
      data:{
        id:id,
        Date:options.day
      }
    }).then((res) => {
      let data = res.Data
      console.log(data)
      let sdate = util.formatTime(util.subDate(data.SDate))
      let edate = util.formatTime(util.subDate(data.EDate))
      data.SDate=_that._day(sdate,true)
      data.EDate=_that._day(edate,true)
      
      _that.setData({
        imgUrls:data.Img,
        data:data,
        day:day,
        date:options.day,
        week:week,
        RoomsId:id,
        isGet:data.isGet
      })
    })
  },
  bindSTimeChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      STime: e.detail.value
    })
  },
  bindETimeChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      ETime: e.detail.value
    })
  },
  _day(date,needDate=false) {
    let d=date.split('-')
    if(needDate) {
      return d[0]+'年' + d[1]+'月' + d[2] + '日'

    } else{
    return d[1]+'月' + d[2] + '日'

    }
  },
  _week(num) {
    let day=''
    switch (parseInt(num)) {
      case 0:
          day = "星期天";
        break;
      case 1:
          day = "星期一";
          break;
      case 2:
          day = "星期二";
          break;
      case 3:
          day = "星期三";
          break;
      case 4:
          day = "星期四";
          break;
      case 5:
          day = "星期五";
          break;
      case 6:
          day = "星期六";
  } 
    return day
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