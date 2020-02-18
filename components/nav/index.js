// components/nav/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    navNames:{
      type:Array,
      value:['党群中心','品牌项目']
    },
    indexId: {
      type:Number,
      value: 0
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
    navTap: function(e){
      let index = e.currentTarget.dataset.index
      this.setData({
        indexId:index
      })
      // let navData = this.properties.navNames
      // for(let i = 0; i<navData.length;i++){
      //   navData
      // }
      this.triggerEvent('nav', {navIndex:index,}, {})
    }
  }
})
