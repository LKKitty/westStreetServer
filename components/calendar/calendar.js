// pages/calendar/calendar.js
import { formatTime } from '../../utils/util.js'
const ONE_DAY = 24 * 60 * 60 * 1000;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    weeks: ['日', '一', '二', '三', '四', '五', '六',],
    animationData: [],
    // today: new Date()
  },

  /**
   * 数据监听器
   */
  observers: {
    /**
     * 监听选中时间，自动更新文本
     */
    'currentDate': function (currentDate) {
      this.setData({
        currentDateText: formatTime(currentDate),
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
   * 获取这星期每一天的号数（周一至周日）
   * @param {Date} date - 日期.
   * @return {Array} 返回星期
   */
    getWeekDay: function (date) {
      // let date = new Date(currentDate);
      let that = this;
      let today =  this.data.today;
      let day = date.getDate();
      let week = date.getDay();
      let monthLastDay = this.getMonthLastDate(date).getDate();
      // console.log(date, day, week, monthLastDay)
      let weekList = [];
      let lastMonth = new Date(date);
      lastMonth.setMonth(date.getMonth() - 1)
      let lastMonthLastDay = this.getMonthLastDate(lastMonth).getDate();
      var count = 1;
      // console.log(11,that.data.currentDateOfWeek)
      let currentDateOfWeek = this.getWeek(date);
      this.setData({
        currentDateOfWeek: currentDateOfWeek,
      })
      let num=24*60*60*1000 ; //一天的毫秒数
      for (let i = 0; i < 7; i++) {
        // console.log(today)
        let istoday = today.getTime() - currentDateOfWeek[i].getTime() 
        if( istoday > 0) {
          // 今天以前
          // if(istoday > num) {
            istoday = -1
          // } 
        } else if(istoday < 0) {
          // 今天以后
          istoday = 1
        } else {
          // 今天
          istoday = 0
        }
        let currentDay = day - week + i;
        // console.log(date)
        // istoday  -1 今天以前  0 今天  1 今天以后 
        //selected是否被选中
        let selected = false
        console.log(this.data.selectDate, this.data.currentDateOfWeek[i], this.data.selectDate == this.data.currentDateOfWeek[i])
        if(this.data.selectDate - this.data.currentDateOfWeek[i] == 0) {
          selected = true
        } else if (!this.data.selectDate && istoday === 0) {
          selected = true
        }
        if (currentDay < 1) {
          weekList.push(
            {num:lastMonthLastDay + currentDay,today:  istoday, selected:selected}
            );
        } else if (currentDay > monthLastDay) {
          weekList.push({num:count++,today: istoday, selected:selected});
        }  else {
          weekList.push({num:currentDay,today:istoday,selected:selected});
        }
        // if(this.data.selectDate && this.data.selectDate == this.data.currentDateOfWeek[i]){
        //   weekList.push({num:currentDay,today: istoday,selected:true});
        // } 
        //  else if (istoday === 0) {
        //   weekList.push({num:currentDay,today: istoday,selected:true});
        // }
      }
      console.log(weekList)
      return weekList;
    },
    /**
     * 获取这星期的每一天（周一至周日）
     * @param {Date} date - 日期.
     * @return {Array} 返回星期
     */
    getWeek: function (date) {
      let day = date.getDate();
      let week = date.getDay();
      let weekList = [];
      for (let i = 0; i < 7; i++) {
        let currentDate = new Date(date);
        currentDate.setDate(day - week + i);
        weekList.push(currentDate);
      }
      return weekList;
    },
    /**
     * 获取当前月的最后一天
     * @param {Date} date - 日期.
     * @return {Date} 返回最后一天的Date类型
     */
    getMonthLastDate: function (date) {
      // 根据计算下个月的第一天减去一天的时间获取
      let currentMonth = date.getMonth();
      let nextMonth = ++currentMonth;
      let nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
      return new Date(nextMonthFirstDay - ONE_DAY);
    },
    /**
     * 日期点击事件
     */
    dayTap: function (e) {
      let self = this;
      let dataset = e.currentTarget.dataset;
      let index = dataset.index;
      let currentDate = this.data.currentDateOfWeek[index];
      let selectedData = this.data.currentDayOfWeek;
      // 如果点击的是今天以前的则返回
      if(selectedData[index].today === -1) {
        console.log('已经过期啦，不能点击')
        return
      }
      // 其他变为不选择
      for(let i = 0;i<selectedData.length;i++) {
        if(currentDate == this.data.currentDateOfWeek[i])
          selectedData[i].selected = true
        else 
        
          // 当前选择为真
          selectedData[i].selected = false
      }
      this.setData({
        weekIndex: index,
        currentDate: currentDate,
        currentDayOfWeek: selectedData,
        selectDate: currentDate,
        // currentDateText: formatTime(currentDate),
      });
      console.log(this.data.selectDate)
      this.triggerEvent('daytap', {day:currentDate,}, {})
    },
    /**
     * 修改星期
     */
    changeWeek: function (e, offsetInput) {
      var offset = offsetInput;
      if (e) {
        var dataset = e.currentTarget.dataset;
        var offset = parseInt(dataset.offset);
      }
      let currentDate = this.data.currentDate;
      let date = new Date(currentDate);
      date.setDate(currentDate.getDate() + offset);
      this.setData({
        currentDate: date,
        // currentDateText: formatTime(date),
        weekIndex: date.getDay(),
        // currentDateOfWeek: this.getWeek(date),
        currentDayOfWeek: this.getWeekDay(date)
      })
    },
    /**
     * 动画
     */
    animation: function (offset = 750) {
      let animation = wx.createAnimation({
        duration: 60, // 持续时间
        timingFunction: 'linear', // 动画效果
        delay: 0, // 延迟时间
      });
      animation.translateX(offset).step();
      this.setData({
        animationData: animation.export(),
      });
    },
    /**
     * 开始触摸
     */
    touchstartHandle: function (e) {
      this.setData({
        touchDotX: e.touches[0].clientX,
      });
    },
    /**
     * 滑动过程
     */
    touchmoveHandle: function (e) {
      let offset = e.touches[0].clientX - this.data.touchDotX;
      // console.log(offset)
      this.animation(offset);
    },
    /**
     * 结束滑动过程
     */
    touchendHandle: function (e) {
      let offset = e.changedTouches[0].clientX - this.data.touchDotX;
      // console.log(offset)
      if (offset > 30) {
        // console.log('上一周')
        this.changeWeek(null, -7);
      } else if (offset < -30) {
        // console.log('下一周')
        this.changeWeek(null, 7);
      }
      this.animation(0);
    },
    /**
     * 初始化组件
     */
    init: function(date) {
      this.setData({
        today: date,
        // selectDate: date,
      })
      this.setData({
        currentDate: date,
        weekIndex: date.getDay(),
        // currentDateOfWeek: this.getWeek(date),
        currentDayOfWeek: this.getWeekDay(date),
      })
    },
  },
  lifetimes: {
    attached: function() {
      
    },
  },
})
