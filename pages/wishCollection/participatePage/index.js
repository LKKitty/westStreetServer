// pages/wishCollection/participatePage/index.js
import WxValidate from "../../../utils/WxValidate"
import {showToast} from "../../../utils/util"
import $ from '../../../utils/http';
import util from "../../../utils/util"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isRepeat: true, //是否可以点击提交
    // 表单验证
    form: {//增加form子元素
      name: '',
      tel: '',
      origin: ['单位','团体','社会组织','个人'],
      idcard: 0,
      reason: '',
      showReason:true
    },
    originIndex:0,
    isTip:false, //是否显示tip
    tips:{
      imgUrl: '/images/tip1.png',
      status: 0,
      msg: '您已登录成功啦！',
      showCanel: false,
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let wishId = options.wishId
    // 初始化表单验证规则
    this.initValidate();
    this.setData({
      wishId:wishId
    })
  },
  bindPickerChange(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      originIndex: e.detail.value
    })
  },
  inputChange(e) {
    let value = e.detail.value
    value = value.replace(/[^\w\.\/]/ig,'')
    return value
  },
  inputReason(e){
    let value = e.detail.value
    this.setData({
      "form.reason": value
    })
  },
// submit 点击注册按钮
formSubmit: function (e) {
  let _that=this
  if (this.data.isRepeat) {
    _that.setData({
      isRepeat: !_that.data.isRepeat,
    })
    let params = e.detail.value;
    if (!this.WxValidate.checkForm(params)) {
      //表单元素验证不通过，此处给出相应提示
      let error = this.WxValidate.errorList[0];
      showToast(error.msg)
      _that.setData({
        isRepeat: !_that.data.isRepeat,
      })
      return false;
      }
  // if(!params.company) {
  //   this.showToast('请输入公司名称')
  //   return false;
  // }
  // for(let key in params) {
  //   // let item = "from[" + key +"]"
  //   if(params[key].split(" ").join("").length === 0) {
  //     showToast('请输入完整信息')
  //     params[key]=''
  //     return  false
  //   }
  // }
  // 校验通过后执行
  // 请求数据
    $.ajax({
      url:'/WebApi/AddWishGet',
      method:'post',
      data:{
        WishId:parseInt(_that.data.wishId),
        Name:params.name,
        Phone:params.tel,
        Type:_that.data.form.origin[_that.data.originIndex],
        IdCard:params.idcard,
        Content:params.reason,
      }
    }).then((res) => {
      _that.setData({
        isRepeat:!_that.data.isRepeat,
          "form.showReason":false,
      })
      let data = res
      if(data.ResultCode == 1000) {
        console.log(data.ResultCode)
        _that.setData({
          isTip:!_that.data.isTip,
          tips:{
            imgUrl: '/images/tipSuc.png',
            status: 2,
            msg: '参与成功',
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
  })} else {
    return
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
        "form.showReason":true,
    })
  }
  console.log(e)
},
// 校验
initValidate() {
  let rules = {
    name: {
      required: true,
      maxlength: 10
    },
    tel: {
      required: true,
      tel: true,
      maxlength: 11
    },
    idcard: {
      required: true,
      idcard: true,
  },
  reason:{
    required: true,
    minlength: 50
  },
  }
  let message = {
    name: {
      required: '请输入姓名',
      maxlength: '名字不能超过10个字'
    },tel: {
      tel: '请输入正确11位电话号码',
      required: '请输入正确11位电话号码'
    },origin: {
      required: '请输入来源'
    },idcard: {
      required: '请输入正确的身份证号码'
    },reason:{
      required: '请输入申请理由',
      minlength:'申请理由不能少于50个字'
    }
  }
  //实例化当前的验证规则和提示消息
  this.WxValidate = new WxValidate(rules,message);
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