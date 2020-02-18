// components/item/index.js
import util from '../../utils/util'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isActive:{
      type:Boolean,
      value: false
    },
    type:{
      type: String,
      value: 'activity'
    },
    item:{
      type:Object,
      value:{}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    title: '',
    Sdate: '',
    Edate: '',
    STime: '',
    ETime: '',
    subTime: '',
    img:'',
    isExpire: '' //是否过期
  },
  ready() {
    this._data()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    _data() {
    let title = this.properties.item.Name  //标题
    let Sdate = this.properties.item.SDate || '' //活动开始时间段
    let Edate = this.properties.item.EDate || '' //活动结束时间段
    let STime = this.properties.item.STime || '' //预约开始时间
    let ETime = this.properties.item.ETime || '' //预约结束时间
    let Img = this.properties.item.Img.split(',')
    let subTime = this.properties.item.AddTime
    let today = new Date()
    // 活动时间
    if(this.properties.type === 'activity') {
      let sdate = util.formatTime(util.subDate(Sdate),true).split('&')
      let edate = util.formatTime(util.subDate(Edate),true).split('&')
      console.log(sdate)
      Sdate=sdate[0]
      STime=sdate[1]
      Edate=edate[0]
      ETime=edate[1]
      if(util.subDate(Edate)<today.getTime()) {
        this.setData({
          isExpire: 1, // 1过期  0 未过期
        })
      }
      if(util.subDate(Edate)>today.getTime()) {
        this.setData({
          isExpire: 0, // 1过期  0 未过期
        })
      }
    }
    // 预约时间
    if(this.properties.type==='reservation') {
      subTime = util.formatTime(util.subDate(subTime))
      STime = util.jointime(STime)
      ETime = util.jointime(ETime)
      if(util.subDate(subTime)<today.getTime()) {
        this.setData({
          isExpire: 1, // 1过期  0 未过期
        })
      }
      if(util.subDate(subTime)>today.getTime()) {
        this.setData({
          isExpire: 0, // 1过期  0 未过期
        })
      }
    }
    // 我的心愿
    if(this.properties.type==='wish') {
      let sdate = util.formatTime(util.subDate(this.properties.item.AddTime),true).split('&')
      let edate = util.formatTime(util.subDate(this.properties.item.AddTime),true).split('&')
      Sdate = sdate[0]
      Edate=edate[0]
    }
    this.setData({
      title:title,
      Sdate: Sdate,
      Edate:  Edate,
      subTime: subTime,
      STime: STime,
      ETime: ETime,
      Img: Img[0]
      // isExpire: isExpire, // 1过期  0 未过期
    })
    },
    itemTap(e) {
      let Id = e.currentTarget.dataset.id
      console.log(Id)
      this.triggerEvent('item', {itemId:Id,}, {})
    },
    canelTap(e) {
      let Id = e.currentTarget.dataset.id
      let title =  e.currentTarget.dataset.title
      if(this.data.isExpire !=1) {
        this.triggerEvent('canel', {canelId:Id,canelTitle:title}, {})
      }
    }
}
})
