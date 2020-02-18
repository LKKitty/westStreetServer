// pages/wishCollection/releasePage/index.js
import WxValidate from "../../../utils/WxValidate"
import {showToast} from "../../../utils/util"
import $ from "../../../utils/http"
//获取应用实例
const app = getApp()
let url = app.globalData.httpUrl
// console.log(ajax)
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isRepeat: true, //是否可以点击提交
    form:{
      name:'',
      tel:'',
      origin: ['单位','团体','社会组织','个人'],
      idcard: 0,
      info: '',
      count: '',
      imgs: [],
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
     // 初始化表单验证规则
    this.initValidate();
  },
  // 输入心愿数量
  keyInput:function(e){
    let count = e.detail.value
   count =count.replace(/[^\w\.\/]/ig,'')
    this.setData({
      "form.count": count
    })
    return count
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
  bindPickerChange(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      originIndex: e.detail.value
    })
  },
// 心愿数量增加/减少
countTap:function(e){
  let arrowName = e.currentTarget.dataset.arrow
  let count = this.data.form.count
  if(arrowName === "up") {
    count++
    this.setData({
      "form.count": count
    })
  }
  if(arrowName === "down") {
    count--
    if(count <= 0) {
      count=1
    }
    this.setData({
      "form.count": count
    })
  }
  console.log(e)
},
// 选择图片
chooseImg:function(e) {
  let _that = this
  let imgs = this.data.form.imgs
  wx.chooseImage({
    count: 1,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success (res) {
      wx.showLoading({
        title: '加载中',
      })
      // tempFilePath可以作为img标签的src属性显示图片
      const tempFilePaths = res.tempFilePaths
    wx.uploadFile({
      url: url+'/Home/UpLoadImg', //仅为示例，非真实的接口地址
      filePath: tempFilePaths[0],
      name: 'upfile',
      formData: {
        'user': 'test'
      },
      success (res){
        wx.hideLoading()
        const data = JSON.parse(res.data).Data
        imgs.push(data)
        _that.setData({
          'form.imgs':imgs
        })
        //do something
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
    }
  })
},
// 预览图片
previewImage (e) {
  let index = e.currentTarget.dataset.index
      wx.previewImage({
        current: this.data.form.imgs[index], // 当前显示图片的http链接
        urls:  this.data.form.imgs // 需要预览的图片http链接列表
      })
    },
// 删除图片
deleteImg:function(e) {
  let index = e.currentTarget.dataset.index
  console.log(index)
  let imgs = this.data.form.imgs
  imgs.splice(index,1)
  this.setData({
    'form.imgs':imgs
  })
},
// submit 点击注册按钮
formSubmit: function (e) {
  let _that=this
  if ( _that.data.isRepeat) {
     _that.setData({
      isRepeat: ! _that.data.isRepeat,
    })
  let params = e.detail.value;
  console.log(params)
  if (!this.WxValidate.checkForm(params)) {
    //表单元素验证不通过，此处给出相应提示
    let error = this.WxValidate.errorList[0];
    showToast(error.msg)
    _that.setData({
      isRepeat: !_that.data.isRepeat,
    })
    return false;
    }
  if(this.data.form.imgs.length === 0) {
    showToast('请上传图片')
    return  false
  }
    // 请求数据
    $.ajax({
      url:'/WebApi/AddWish',
      method:'post',
      data:{
        Name:params.name,
        Phone:params.tel,
        Type:_that.data.form.origin[_that.data.originIndex],
        Content:params.info,
        IdCard:params.idcard,
        MaxCount:params.count,
        Imgs:_that.data.form.imgs.join(','),
        Infos:_that.data.form.reason,
      }
    }).then((res) => {
      _that.setData({
        "form.showReason":false
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
            msg: data.Message,
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
    })
    } else {
      return
    }
  // 校验通过后执行
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
      isRepeat: !_that.data.isRepeat,
    })
  }
  console.log(e)
},
// 校验
initValidate() {
  let  rules={
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
  info:{
    required: true
  },
  count:{
    required: true,
    min: 1,
    max:10000,
  },
  reason:{
    required: true
  }
  }
  let message = {
    name: {
      required: '请输入姓名',
      maxlength: '名字不能超过10个字'
    },tel: {
      tel: '请输入正确11位电话号码',
      required: '请输入正确11位电话号码'
    },idcard: {
      required: '请输入正确的身份证号码'
    },info:{
      required: '请输入心愿内容' 
    },
    count:{
      required: '请输入心愿数量',
      min: '心愿数量不能为0',
      max: '心愿数量不能大于10000',
    },
    reason:{
      required: '请输入心愿说明'
    }
  }
  //实例化当前的验证规则和提示消息
  this.WxValidate = new WxValidate(rules, message);
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