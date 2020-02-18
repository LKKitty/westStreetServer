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
    wishType:{
      type: Number,
      value: 0 //0我领取的心愿 1我发布的心愿
    },
    isFrom:{
      type:Number,
      value:1 //1从首页进入 0从个人中心进入
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
    activityStatus:['未开始','进行中','已结束','取消报名','去打卡','到场','未到场','待审核'],
    activityIndex:0,
    reservStatus: ['取消预约','已结束','进行中'],
    reservIndex:0,
    wishT: '',
    JoinCount:0,
    title: '',
    date: '',
    Sdate: '',
    Edate: '',
    STime: '',
    ETime: '',
    time: '',
    subTime: '',
    isExpire: '',//是否过期
    itemId: 0, //查询详情ID
    canelId: 0,// 个人中心查询详情、删除Id
  },
  // ready() {
  //   this._data()
  // },
  /**
   * 数据监听器
   */
  observers: {
    /**
     * 监听选中时间，自动更新文本
     */
    'item': function (item) {
      // console.log(item)
      this._data()
      // this.setData({
      //       JoinCount:item.JoinCount,
      //       title: item.Name
      //     })
        }
    // 'JoinCount': function (JoinCount) {
    //   console.log(JoinCount)
    //   this.setData({
    //     JoinCount:JoinCount
    //   })
    // }
  },
  /**
   * 组件的方法列表
   */
  methods: {

    // 数据初始化
    _data() {
      let isfrom = this.properties.isFrom
      let wishType = this.properties.wishType
      var title = this.properties.item.Name  //标题
      let Sdate = this.properties.item.SDate || '' //活动/预约开始日期
      let Edate = this.properties.item.EDate || '' //活动/预约结束日期
      let ETime = this.properties.item.EndTime || '' //活动/预约开始时间
      let STime = this.properties.item.StartTime || '' //活动/预约结束时间
      let Img = this.properties.item.Img || '/images/111.jpg'
      Img =Img.split(',') 
      let itemid = this.properties.item.Id //查询详情
      let canelid = this.properties.item.Id //取消报名/预约
      let expire = 0
      let sdate = util.formatTime(util.subDate(Sdate))
      let edate = util.formatTime(util.subDate(Edate))
      let name = this.properties.item.StatusName || ''
      let JoinCount = this.properties.item.JoinCount 
      console.log('运行')
      let index = 0
      // this._reserve(sdate,STime,sdate,ETime)
      Sdate=this._day(sdate)
      Edate=this._day(edate)
      let date = Sdate + '-'+ Edate
      if(Edate === Sdate  || !Edate) {
        date = Sdate
      }
      // 活动状态
      if(this.properties.type === 'activity') {
        date = Sdate
        Edate=''
        STime = util.jointime(STime)
        ETime = util.jointime(ETime)
        if(isfrom ===1) { //列表进入
          if(name === '未开始') {
            index=0
          }
          if(name === '进行中') {
            index=1
          }
          if(name === '已结束') {
            index=2
          }
        }
        // 从个人中心进来获取的预约时间是自己预约的那天
        if(isfrom ===0) { 
          // activityStatus:['未开始','进行中','已结束','取消报名','去打卡','到场','未到场','待审核'],
           // 0未开始 1进行中  2已结束
          itemid = this.properties.item.ActivityId
          expire = util.expireDate(sdate,STime,sdate,ETime)
          let actStatus = this.properties.item.Status //审核状态
          console.log(expire,actStatus) 
          if(actStatus === 0 || actStatus === '未审核') { //未审核
            index=7 //待审核
            if(expire === 2) {
              index = 2 //未审核已结束显示结束
            }
          } else { //审核
            if(expire === 0) { //未开始
              index=3 //取消报名
            }
            if(expire === 1) { //进行中
              if(this.properties.item.IsSign === 0) {
              index=4 //未签到显示去打卡
              }else if(this.properties.item.IsSign === 1) {
                index=5 //签到显示到场
              } else {
                index=6 //其他未到场
              }
            }
            if(expire === 2) { //已结束
              if(this.properties.item.IsSign === 0) {
                index=6 //未到场
              } else if(this.properties.item.IsSign === 1) {
                index=5 //已到场
              } else {
                index=6
              }
            }
          }
        }
      }
      // 从个人中心进来获取的预约服务时间是自己预约的那天
      if (this.properties.type === 'reservation') {
        if(isfrom ===0) {
          // 预约日期
          let resSdate = util.formatTime(util.subDate(this.properties.item.AddTime))
          STime = this.properties.item.STime
          ETime = this.properties.item.ETime
          // 0未开始 1进行中  2已结束
          expire = util.expireDate(resSdate,STime,resSdate,ETime)
          console.log(expire)
          if(expire === 0) {
            index=0
          }
          if(expire === 1) {
            index=2
          }
          if(expire === 2) {
            index=1
          }
          // 显示预约的时间
          itemid = this.properties.item.RoomsId
          date = this._day(resSdate)
        }
      }
      // 我的心愿
      if (this.properties.type === 'wish') {
        if(isfrom ===0) {
          let wishSdate = util.formatTime(util.subDate(this.properties.item.AddTime))
          itemid = this.properties.item.WishId
          date = this._day(wishSdate)
          title = this.properties.item.Remark
        }
      }
      this.setData({
        title:title,
        date:date ,
        Sdate: Sdate,
        Edate:  Edate,
        activityIndex: index,
        JoinCount:JoinCount,
        ETime:ETime,
        STime:STime,
        reservIndex:index,
        Img: Img[0],
        itemId:itemid,
        canelId:canelid,
        wishT:wishType
        // isExpire: isExpire, // 1过期  0 未过期
      })

      },
    itemTap(e) {
      let Id = this.data.itemId
      // console.log(Id)
      let title =  this.data.title
      let date = util.formatTime(util.subDate(this.properties.item.AddTime)) //预约的时间
      let week = util.subDate(this.properties.item.AddTime).getDay() //预约的星期
      console.log('进入详情：',date,week)
      this.triggerEvent('item', {Id:Id,date:date,week:week,title:title}, {})
    },
    //点击取消按钮、去打卡按钮
    operatTap(e) {
      let Id = this.data.canelId //取消ID
      let itemId = this.data.itemId //详情Id
      let title =  this.data.title
      let type = e.currentTarget.dataset.type //取消的类型
      let date = util.formatTime(util.subDate(this.properties.item.AddTime)) //预约的时间
    let week = util.subDate(this.properties.item.AddTime).getDay() //预约的星期
      console.log(Id,type)
      this.triggerEvent('operat', { operatId: Id, itemId:itemId,operatTitle:title,operatType:type,date:date,week:week}, {})
    },
    _day(date) {
      let d=date.split('-')
      return d[0]+'年' + d[1]+'月' + d[2] + '日'
    },
  }
})
