// pages/wishCollection/detailPage/index.js
import $ from '../../../utils/http';
import util from "../../../utils/util"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 0, //0从个人中心进入   1从列表页进入
    imgUrls:'', //banner
    upImgs: '', //取得上传的图片
    expand1:false, //动画1
    expand2:false, //动画2
    wishData: {}
  },
  expand1() {
    // 动画
    let _ani = this._aniHeight(this.data.expand1,'.center_text',90)
    _ani.then((res) =>{
      console.log(res)
      this.setData({
        expand1:!this.data.expand1,
        ani1:  res
      })
    })
  },
  expand2() {
    // 动画
    let _ani = this._aniHeight(this.data.expand2,'.three_center',90)
    _ani.then((res) =>{
      console.log(res)
      this.setData({
        expand2:!this.data.expand2,
        ani2:  res
      })
    })
  },
  onwishGo(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../wishGo/index?wishId=' + id
    })
  },
  submit(e) {
    let id = e.currentTarget.dataset.id
    console.log(this.data.wishData.IsGet)
    if(this.data.wishData.IsGet === 1){
      util.showToast('您已经参与心愿啦~')
      return
    }
    wx.navigateTo({
      url: '../participatePage/index?wishId=' + id
    })
  },
  //expand 动画绑定 viewName 展开容器的类名 height收回的高度
_aniHeight(expand,viewName,height) {
  return new Promise((resolve,reject) =>{
    var query = wx.createSelectorQuery();
    var textHeight = 0
    query.select(viewName).boundingClientRect()
    var animation = wx.createAnimation({
      duration: 2000,
      timingFunction: 'ease',
      delay: 0
    });
    query.exec((res) => {
      textHeight = res[0].height; // 获取list高度
      if(!expand) {
        animation.height(textHeight).step()
      } else {
        animation.height(height).step()
      }
      resolve(animation.export())
    })
  })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _that =this
    wx.setNavigationBarTitle({
      title: options.title
    })
    // 请求数据
    $.ajax({
      url:'/WebApi/GetWishImgs',
      method:'post',
    }).then((res) => {
      let data = res.Data
      let bannerImgs = []
      for(let i=0;i<data.length;i++) {
        bannerImgs.push(data[i].Imgs1)
      }
      bannerImgs= bannerImgs.join(',')
      console.log(bannerImgs)
      _that.setData({
        imgUrls: bannerImgs
      })
    })
    let id = options.Id
    let type = options.type
    console.log(type)
    _that.setData({
      type: parseInt(type)
    })
    this._ajaxData(id)
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
  
  _ajaxData(id) {
    let _that =this
    // 请求数据
    $.ajax({
      url:'/WebApi/GetWishById',
      method:'post',
      data:{
        Id:parseInt(id)
      }
    }).then((res) => {
      let data = res.Data
      console.log(data)
      let upImgs = data.Imgs || '/images/111.jpg'
      upImgs=upImgs.split(',')
      if(upImgs[upImgs.length-1] === '') {
        upImgs.pop()
      }
      _that.setData({
        upImgs: upImgs,
        wishData:data
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