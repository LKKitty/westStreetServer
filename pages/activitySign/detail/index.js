// pages/activitySign/detail/index.js
import {showToast} from "../../../utils/util"
import util from "../../../utils/util"
import $ from '../../../utils/http'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isRepeat: true, //是否可以点击提交
    ActivityId: 0,
    imgUrls: '',
    navNames:[
      '活动详情','导航地址','活动须知'
    ],
    indexId:0,
    SDate:'', //活动开始日期
    EDate:'', //活动结束日期
    STime:'', //活动开始时间
    ETime:'', //活动结束时间
    unit:'',//主办单位
    addr:'', //活动地址
    pointSTime:'', //打卡时间段
    pointETime:'', //打卡时间段
    learnTime:'', //学习时长
    noite:'', //活动须知
    status:'进行中', //活动状态
    StatusText: '', //按钮显示的文字
    bottonStatus: [0,1,0.8], //按钮透明程度
    bottonStatusIndex:0,
    isJoin: 0,//是否报名
    isSign: 0,//是否签到
    isMap:true, //是否显示地图
    markers: [{
      iconPath: "./images/loc.png",
      id: 0,
      width: 30,
      height: 30,
      latitude: 23.099994,
      longitude: 113.324520,
    }],
    latitude: 23.099994,
    longitude: 113.324520,
    isTip:false, //是否显示tip
    tips:{
      imgUrl: '/images/tip1.png',
      status: 2,
      msg: '您已登录成功啦！',
      showCanel: false,
    }
  },
  // 点击图标
  markertap(e) {
    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.userLocation" 这个 scope
    this._authSetting(this._navLocation)
  },
  // 点击地图
  clickMap(){
    this._authSetting(this._navLocation)
  },
  // 点击我要报名、打卡签到
  mySubmit() { 
    let _that=this
    if(this.data.StatusText === '已满') {
      util.showToast('报名人数已满，请选择其他活动哦~')
      return
    }
    if(this.data.StatusText === '已报名' || this.data.StatusText === '已签到') {
      util.showToast(this.data.StatusText)
      return
    }
    if(this.data.StatusText === '我要报名') {
      if(_that.data.isRepeat) {
        _that.setData({
          isRepeat:!_that.data.isRepeat
        })
        // 请求数据
        $.ajax({
          url:'/WebApi/JoinActivity',
          method:'post',
          data:{
            ActivityId:_that.data.ActivityId
          }
        }).then((res) => {
          _that.setData({
            isRepeat:!_that.data.isRepeat,
            isMap:!_that.data.isMap,
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
                msg: '报名成功',
                showCanel: false,
              }
            })
          } else {
            console.log(data.ResultCode)
            _that.setData({
              isTip:!_that.data.isTip,
              // isMap:!_that.data.isMap,
              tips:{
                imgUrl: '/images/tipfal.png',
                status: 2,
                msg: data.Message,
                showCanel: false,
              }
            })
          }
        })
    } else {
        return
      }
      }
    if(this.data.StatusText === '打卡签到') {
      this._authSetting(this._myLoc)
    }
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
        isMap:!_that.data.isMap,
      })
    }
    console.log(e)
  },
  // 用户地理位置授权
  _authSetting(locFun){
    let _that =this
    _that.setData({
          isMap:!_that.data.isMap,
    })
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
        // 如果没有授权，先授权
          wx.authorize({
            scope: 'scope.userLocation',
            success () {
              // 授权成功，用户已经同意小程序使用位置功能
              locFun()
            },
            fail () {
              // 授权失败，弹窗提示授权
              wx.showModal({
                title: '提示',
                content: '您还没有进行位置授权噢，请设置',
                success (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    wx.openSetting({
                      success (res) {
                        console.log(res.authSetting)
                        // res.authSetting = {
                        //   "scope.userLocation": true
                        // }
                      }
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            }
          })
        } else {
          // 用户已经同意小程序使用位置功能
          // _that.mapLocation(7)
          locFun()
        }
      }
    })
  },
  // 地址导航
  _navLocation() {
      let _that = this
      wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success (res) {
          const latitude = res.latitude
          const longitude = res.longitude
          _that.setData({
            isMap: true,
          })
          wx.openLocation({
            latitude:parseFloat(_that.data.latitude),
            longitude:parseFloat(_that.data.longitude),
            scale: 18,
            name:_that.data.addr,
            address: _that.data.addr
          })
        }
      })
    },
  //  获取当前地址
  _myLoc() {
    let _that = this
    //目标经纬度
    let end_latitude = _that.data.markers[0].latitude 
    let end_longitude = _that.data.markers[0].longitude
    // 当前时间
    let nowTime = new Date().getHours()
    // 打卡时间段
    // let time_dct = '8:00 -14:00'
    console.log(nowTime)
      wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success (res) {
          const start_latitude = res.latitude
          const start_longitude = res.longitude
          console.log("当前位置：" + start_latitude + "-----" + start_longitude)
          // let dtc =_that. _distance(start_latitude,start_longitude,end_latitude,end_longitude)
          // if(dtc > 0.5) {
          //   showToast('500米内才能打卡签到噢')
          // } else{
          //   showToast('签到成功')
          // }
          if(_that.data.isRepeat) {
              _that.setData({
              isRepeat:!_that.data.isRepeat,
            })
                // 请求数据
            $.ajax({
              url:'/WebApi/SignActivity',
              method:'post',
              data:{
                ActivityId:_that.data.ActivityId,
                Lat: start_latitude,
                Lng: start_longitude
              }
            }).then((res) => {
              _that.setData({
                isRepeat:!_that.data.isRepeat,
                // isMap:!_that.data.isMap,
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
                    msg: '签到成功',
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
            }) } else {
              return
            }
          // console.log(dtc)
        }
      })
  },

// 计算两地之间的距离(默认单位km)
_distance(lat1, lng1, lat2, lng2) {
  console.log(lat1, lng1, lat2, lng2)
  var radLat1 = lat1 * Math.PI / 180.0;
  var radLat2 = lat2 * Math.PI / 180.0;
  var a = radLat1 - radLat2;
  var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0; 
  //进行经纬度转换为距离的计算
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137;
  s = Math.round(s * 10000) / 10000; //输出为公里
  return s
},

  // clickMap(e){
  //   wx.getLocation({
  //     type: 'gcj02', //返回可以用于wx.openLocation的经纬度
  //     success (res) {
  //       const latitude = res.latitude
  //       const longitude = res.longitude
  //       console.log(res)
  //       wx.openLocation({
  //         latitude:22.630767,
  //         longitude:113.812394,
  //         scale: 18,
  //         name: '深圳宝安国际机场T3航站楼'
  //       })
  //     }
  //    })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _that=this
    let id=parseInt(options.Id)
    wx.setNavigationBarTitle({
      title: options.title
    })
    console.log(options)
    // 请求数据
    $.ajax({
      url:'/WebApi/GetActivityById',
      method:'post',
      data:{
        Id:id
      }
    }).then((res) => {
      let data = res.Data[0]
      console.log(data)
      let sdate = util.formatTime(util.subDate(data.SDate),true).split('&')
      let text =  _that._status(data.StatusName,data.IsJoin,data.IsSign,data.MaxPeople,data.JoinCount)
      console.log(text)
      _that.setData({
        ActivityId:id,
        title:data.Name,
        imgUrls:data.Img,
        SDate:_that._day(sdate[0]),
        STime: util.jointime(data.StartTime),
        ETime: util.jointime(data.EndTime),
        pointSTime: util.jointime(data.StartDate),
        pointETime: util.jointime(data.EndDate),
        addr:data.Address,
        unit:data.Content,
        latitude: data.Lat,
        longitude: data.Lng,
        learnTime:data.Hours,
        noite:data.Remark,
        status:data.StatusName,
        isJoin:data.IsJoin,
        isSign:data.IsSign,
        StatusText:text.statusText,
        bottonStatusIndex:text.bottonStatusIndex,
        markers: [{
          iconPath: "./images/loc.png",
          id: 0,
          width: 30,
          height: 30,
          latitude: data.Lat,
          longitude: data.Lng,
        }],
        // latitude: 22.720457,
        // longitude:114.049072
      })
      
    })
  },
  // 状态未开始
  /* 
  活动状态：text 未开始、进行中、已结束 
  是否报名： join 0 未报名 1已报名
  是否签到： sign 0未签到  1 已签到
  总人数： max
  报名人数： num
  */
  _status(text,join,sign,max,num) {
    let statusText=''
    let bottonStatusIndex = 0
    if(max === 0 || max === null) {
      max = 100000
    }
    if(text === '未开始') {
      if(max <= num){
        // bottonStatusIndex=2
        // statusText='已满' // 已满
        if(join === 0) {
          bottonStatusIndex=2 
          statusText='已满'
        }
        if(join === 1) {
            bottonStatusIndex=2
            statusText='已报名'
        }
        if(join === 2) {
            bottonStatusIndex=2
            statusText='待审核'
        }
      } else{
        if(join === 0){
          bottonStatusIndex=1
          statusText='我要报名'
        }
        if(join === 1){
          bottonStatusIndex=2
          statusText='已报名' //已经报名
        }
        if(join === 2) {
            bottonStatusIndex=2
            statusText='待审核'
        } 
      } 
    }
    if(text === '进行中') {
      if(join === 0){
        bottonStatusIndex=0
        statusText='隐藏' // 已开始未参加不显示按钮
      } 
      if(join === 1){ //已参加
        if(sign === 0 ) { //未签到
          bottonStatusIndex=1
          statusText='打卡签到'
        }
        if(sign === 1) { //已经签到
          bottonStatusIndex=0.8
          statusText='已签到' //已经签到
        }
        if(join === 2) {
            bottonStatusIndex=2
            statusText='待审核'
        }
      }
    }
    if(text === '已结束') { //已结束不显示按钮
      bottonStatusIndex=0
        statusText='隐藏'
    }
    return {statusText:statusText,bottonStatusIndex:bottonStatusIndex}
  },
  navTap(e) {
    let navIndex = e.detail.navIndex
    console.log(navIndex)
    this.setData({
      indexId: navIndex
    })
  },
  changeIndicatorDots: function(e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function(e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function(e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function(e) {
    this.setData({
      duration: e.detail.value
    })
  },
  _day(date) {
    let d=date.split('-')
    return  d[0]+'年' +  d[1]+'月' + d[2] + '日'
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