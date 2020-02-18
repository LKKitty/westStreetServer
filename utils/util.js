const formatTime = (date, needTime = false)  => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + (needTime == true ? ('&' + [hour, minute].map(formatNumber).join(':')) : '')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// 版本库比较
function compareVersion(v1, v2) {
  v1 = v1.split('.')
  v2 = v2.split('.')
  const len = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i])
    const num2 = parseInt(v2[i])

    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }

  return 0
}
const subDate = (date)=> {
  let dd = date.substring(6, date.length-2);
  return new Date(parseInt(dd))
}
// 弹窗
let showToast = (error) => {
  wx.showToast({
    title: error,
    icon: 'none',
    duration: 2000
  })
}
// 后台日期转换
let formatDate = (date) => {
  let dd = date.substring(6, date.length-2);
  var d = new Date(parseInt(dd))
  var ar_date = [d.getFullYear(), d.getMonth() + 1, d.getDate()];
  var ar_time =[d.getHours(),d.getMinutes()]
  for (var i = 0; i < ar_date.length; i++)
      ar_date[i] = ar_date[i] < 10 ? "0" + ar_date[i].toString() : ar_date[i];;
  return {date:ar_date.join('-'),time:ar_time.join(':')};
}
// 转换时间段
let jointime =(time)=>{
  let s =time.split(":")
  // s.pop()
  // let t = s.join(":")
  return formatNumber(s[0]) + ':' +formatNumber(s[1])
}
//判断某个时间是否大于另一个时间的半个小时 sdate 开始时间  edate 结束时间 min 比较时间分钟
let isminutes =(sdate,edate,min) => {
  //要对比的分钟
  let ms = 60000 //一分钟=60000毫秒
  let m = min * ms 
  let sms =sdate.getTime() //返回 1970 年 1 月 1 日至sdate的毫秒数
  let ems =edate.getTime() //返回 1970 年 1 月 1 日至sdate的毫秒数
  let dif = ems - sms 
  console.log(sms,ems,dif)
  if(dif > m) {
    console.log('大于30分钟')
  }
  if(dif === m) {
    console.log('等于30分钟')
  }
  if(dif < m) {
    console.log('小于30分钟')
  }
}
// 是否过期
let expireDate =(sdate,stime,edate,etime) => {
  let expire=0 // 0未开始 进行中  2已结束
  let now=formatTime(new Date(),true).split('&')
  let current = now[0].split('-').join('') + jointime(now[1]).split(':').join('')
  let start = sdate.split('-').join('') + jointime(stime).split(':').join('')
  let end = edate.split('-').join('')+jointime(etime).split(':').join('')
  if(parseInt(current)<parseInt(start)) {
    expire=0
    // console.log('未开始',current,start,end)
  }
  if(parseInt(current)>parseInt(start) && parseInt(current)< parseInt(end)) {
    expire=1
    // console.log('进行中',current,start,end)
  }
  if(parseInt(current)>parseInt(end)) {
    expire=2
    // console.log('过了结束时间',current,start,end) 
  }
  return expire
}
module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  jointime:jointime,
  showToast:showToast,
  expireDate:expireDate,
  subDate:subDate,
  isminutes:isminutes,
  compareVersion: compareVersion
}
