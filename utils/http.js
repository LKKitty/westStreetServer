 //调用公共js对象以便调用其方法
var app = getApp();//获取应用实例
let url = app.globalData.httpUrl
function ajax(model){
  if(!wx.getStorageSync('openid')) {
    wx.showToast({
      title: '请先登录',
      icon: 'none',
      duration: 2000
    })
    wx.navigateTo({
      url: '/pages/personalCenter/index'
    })
    return
  }
  wx.showLoading({
    title: '加载中',
  })
  //拼接url
  model.url = url + model.url;
  //get参数拼接
  if (model.method == "get" && model.data !== undefined) {
    for (let k in model.data) {
      if (model.data[k].toString() !== '') {
        model.url = model.url + "&" + k + "=" + model.data[k];
      }
    }
    model.data='';
  }
  let header = {
    'content-type': 'application/json',
    'auth':wx.getStorageSync('openid')
  }
  //返回Promise对象
  return new Promise(
    function (resolve) {
      wx.request({
        method: 'post',
        url: url + '/Home/CreateToken',
        data:{
          openid: wx.getStorageSync('openid')
        },
        // header: header,
        success: (res) => {
          console.log(res)
          if (res.statusCode == 200) {
            wx.request({
              method: model.method,
              url: model.url,
              data: model.data,
              header: {
                'content-type': 'application/json',
                'auth':res.data.Data
              },
              success: (res) => {
                wx.hideLoading()
                if (res.statusCode == 200) {
                  resolve(res.data);
                } else {
                  //错误信息处理
                  wx.showModal({
                    title: '提示',
                    content: '服务器错误，请联系客服',
                    showCancel: false,
                  })
                }
              }
            })
          } else {
            //错误信息处理
            wx.hideLoading()
            wx.showModal({
              title: '提示',
              content: res.statusCode,
              showCancel: false,
            })
            setTimeout(() =>{
              wx.switchTab({
                url: '/pages/personalCenter/index' //登录页面
              })
            },2500)
          }
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
    },
    function(reject) {
      reject()
    }
  )
}
module.exports = {
  ajax: ajax,
  url: url
}