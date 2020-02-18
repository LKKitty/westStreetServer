// components/bannerSwiper/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imgUrls:{
      type:String,
      value:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgs:[],
    indicatorDots:true
  },
  observers: {
    /**
     * 监听选中时间，自动更新文本
     */
    'imgUrls': function (imgUrls) {
      this._imgs()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    _imgs() {
      let imgs = this.properties.imgUrls
      let isindicatorDots = true
      imgs=imgs.split(',')
      if(imgs.length === 1) {
        isindicatorDots=false
      }
      this.setData({
        imgs:imgs,
        indicatorDots:isindicatorDots
      })
    }
  }
})
