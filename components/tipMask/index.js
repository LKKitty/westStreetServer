// components/tipMask/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /**
     * @param
     * imgUrl:图标地址
     * status：状态(0成功  1失败 2其他)
     * title: 显示的大标题
     * msg: 状态提示语
     * showCanel: 是否显示取消按钮
     */
    tip:{
      type: Object,
      value:{
        imgUrl: '/images/tip1.png',
        status: 0,
        msg: '您已注册成功啦！',
        showCanel: false,
      }
    }
  }, 

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击确认
    onTip (e) {
      let status = e.currentTarget.dataset.status
      this.triggerEvent('tip', {status:status}, {})
    }
  }
})
