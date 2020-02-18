// pages/personalCenter/index.js
import WxValidate from "../../utils/WxValidate"
import {showToast,formatTime} from "../../utils/util"
import $ from '../../utils/http'
var app = getApp();//获取应用实例
let timer;
console.log(app)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists:{},
    isRegister: false, //是否注册过,
    isRepeat:true, //是否点击提交
    isSend:true, //是否点击发送验证码
    openid: '',
    showRegisterMaster: false, //是否显示注册页面
    // 表单验证
    form: {//增加form子元素
      Name: '',
      Phone: '',
      code: '',
      codeText: '发送验证码',
      codeTime: 60,
      category: ['市民','党员干部','党员','企业员工'],
      selectCate: '',
      ComName:''
    },
    cateIndex: 0,
    // 弹窗内容
    isTip:false,
    tips: {
      imgUrl: '/images/tipSuc.png',
      status: 0,
      msg: '您已注册成功啦！',
      showCanel: false
    } //提示内容
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(wx.getStorageSync('isRegister'),wx.getStorageSync('openid'))
    this.setData({
      openid:wx.getStorageSync('openid'),
      isRegister: wx.getStorageSync('isRegister')
    })
    // 初始化表单验证规则
    this.initValidate();
    // 已授权
    if(this.data.openid) {
      // 已注册请求数据
      if(this.data.isRegister) {
        this._listsGet()
      } else{
        //未注册显示注册弹窗
        this.setData({
          showRegisterMaster: !this.data.showRegisterMaster
        })
      }
    } else {
      return true
    }
  },
  
  // 跳转详情
  onDetail(e) {
    // type: activity 我的活动  reservation：我的预约  wish：我的心愿
    let type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: './detail/index?type=' + type
    })
  },
//点击登录注册
onGotUserInfo(e) {
  console.log(e)
  let _that = this
  if(e.detail.errMsg ==='getUserInfo:ok') {
    wx.showLoading({
      title: '加载中',
    })
    // 登录
    wx.login({
      success (res) {
        if (res.code) {
          wx.request({
            url: app.globalData.httpUrl + '/WebApi/SaveUser',
            method: 'POST',
            header: {
              'content-type': 'application/json'
            },
            data: {
              'code': res.code,
              'encryptedData':e.detail.encryptedData,
              'iv':e.detail.iv
            },
            success: function(res) {
              console.log(res)
              wx.hideLoading()
              wx.setStorageSync('openid', res.data.openid)
              // isHave 1 已注册   0未注册
              if(res.data.isHave == 1) {
                // 存入已注册标识
                wx.setStorageSync('isRegister',true)
                _that.setData({
                  openid:wx.getStorageSync('openid'),
                  isRegister: wx.getStorageSync('isRegister')
                })
                _that._listsGet()
                return
              }
              //存入未注册标识
              wx.setStorageSync('isRegister',false)
              // 未注册弹窗注册
              _that.setData({
                openid:wx.getStorageSync('openid'),
                isRegister: wx.getStorageSync('isRegister'),
                showRegisterMaster: !_that.data.showRegisterMaster,
              })
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      },
      fail:(res) =>{
        console.log('登录失败！' + res.errMsg)
      }
    })
  } else {
    showToast('亲亲，授权注册会员有大惊喜噢~')
    return
  }
  
},
  // submit 点击注册按钮
  formSubmit: function (e) {
    let params = e.detail.value;
    let _that =this 
    console.log(params)
    if (!this.WxValidate.checkForm(params)) {
      //表单元素验证不通过，此处给出相应提示
      let error = this.WxValidate.errorList[0];
      showToast(error.msg)
      return false;
      }
    // for(let key in params) {
    //   // let item = "from[" + key +"]"
    //   if(params[key].split(" ").join("").length === 0) {
    //     showToast('请输入完整信息')
    //     params[key]=''
    //     return  false
    //   }
    // }
    
    // openId
    params.OpenId =wx.getStorageSync('openid')
    // 头像
    params.Icon =wx.getStorageSync('Icon')
    // 类型 下标+1
    params.Type = parseInt(params.Type) + 1

    // 校验通过后执行
    if (this.data.isRepeat) {
      _that.setData({
        isRepeat:!this.data.isRepeat
      })
      wx.request({
        url: app.globalData.httpUrl + '/WebApi/AddUser',
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        data: params,
        success: function(res) {
          console.log(res)
          if(res.data.Message === '注册成功') {
            wx.setStorageSync('isRegister',true)
            _that.setData({
              isTip: true,
              showRegisterMaster:false,
              isRegister: wx.getStorageSync('isRegister'), 
              isRepeatisRepeat: !this.data.isRepeat
            })
          }
        }
      })
    }
  },
  inputChange(e) {
    let value = e.detail.value
    value = value.replace(/[^\w\.\/]/ig,'')
    return value
  },
  bindPickerChange(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      cateIndex: e.detail.value
    })
  },
  // 校验
  initValidate() {
    let  rules={
      Name: {
        required: true,
        maxlength: 10,
        minlength:1
      },
      Phone: {
        required: true,
        tel: true,
        maxlength: 11
      },
      Code:{required: true,},
      ComName:{
        required: true,
        maxlength: 50
      },
    }
    let message = {
      Name: {
        required: '请输入姓名',
        maxlength: '名字不能超过10个字'
      },Phone: {
        tel: '请输入正确11位电话号码',
        required: '请输入正确11位电话号码'
      },
      Code:{
        required: '请输入验证码'
      },ComName: {
        required: '请输入公司名称',
        maxlength: '公司名称最多可以输入50个名称'
      }
    }
    //实例化当前的验证规则和提示消息
    this.WxValidate = new WxValidate(rules, message);
  },
  // 发送验证码倒计时
  sendCode () {
    if (this.data.isSend) {
      this.setData({
        isSend: !this.data.isSend
      })
      let time =this.data.form.codeTime
      timer = setInterval(()=>{
        if( time == 0) {
          console.log(time)
          this.setData({
            "form.codeText": "发送验证码",
            isSend:!this.data.isSend
          })
          clearInterval(timer)
          return
        }
        time--
        this.setData({
          "form.codeText": time
        })
      },1000)
    }
  },
  timer: function () {
    let _that=this
    let promise = new Promise((resolve, reject) => {
      let setTimer = setInterval(
        () => {
          _that.setData({
            'form.codeTime': _that.data.form.codeTime - 1
          })
          if (_that.data.form.codeTime <= 0) {
            this.setData({
              "form.codeText": "发送验证码"
            })
            resolve(setTimer)
          }
        }
        , 1000)
    })
    promise.then((setTimer) => {
      clearInterval(setTimer)
    })
  },
  // 监听弹窗内容
  onTip(e) {
    console.log(e)
    let status = e.detail.status
    if (status == 0) {
      this.setData({
        isTip: !this.data.isTip
      })
    }
  },
// 关闭注册页面
closeRegister() {
  clearInterval(timer)
  this.setData({
    showRegisterMaster: !this.data.showRegisterMaster
  })
},
_listsGet() {
  let _that =this
  $.ajax({
    url:'/WebApi/GetList',
    method: 'Post',
  }).then((res)=>{
    let lists ={}
    console.log(res)
    if(res.alist[0]) {
      let img = res.alist[0].Img === null ? "/images/111.jpg" : res.alist[0].Img
      img = img.split(',')
      // console.log(img)
      res.alist[0].RoomsImg = img[0]
      res.alist[0].RoomsIcon = '/pages/personalCenter/images/activity_icon.png'
      res.alist[0].RoomsTitle = '我的活动'
      lists.activity=res.alist[0]
    }
    if(res.slist[0]) {
      let img = res.slist[0].Img || ''    
      img = img.split(',')
      res.slist[0].RoomsImg = img[0]
      res.slist[0].RoomsIcon = '/pages/personalCenter/images/reservation_icon.png'
      res.slist[0].RoomsTitle = '我的预约'
      lists.reservation=res.slist[0]
    }
    if(res.wGetlist[0]) {
      let img = res.wGetlist[0].Img || ''
      img = img.split(',')
      res.wGetlist[0].RoomsImg = img[0]
      res.wGetlist[0].RoomsIcon = '/pages/personalCenter/images/wish_icon.png'
      res.wGetlist[0].RoomsTitle = '我的心愿'
      res.wGetlist[0].Name = res.wGetlist[0].Remark
      res.wGetlist[0].Remark = res.wGetlist[0].Infos
      lists.wish=res.wGetlist[0]
    }
    _that.setData({
      lists:lists
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
    // 已授权
    if(this.data.openid) {
      // 已注册请求数据
      if(this.data.isRegister) {
        this._listsGet()
      } else{
        //未注册显示注册弹窗
        this.setData({
          showRegisterMaster: !this.data.showRegisterMaster
        })
      }
    }
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