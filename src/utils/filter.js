import Vue from 'vue';
import time from './time';

Vue.filter('time', function (value, format) {
  if (!value) return '';
  let _format = format || 'yyyy-MM-dd';//'yyyy-MM-dd HH:mm:ss'
  let date = new Date();
  date.setTime(value);
  return time.dateFormat(date, _format);
})

Vue.filter('sex', function (value) {
    if (!value) return ''
    let newValue = '';
    switch(value) {
      case 0:
        newValue = '未知';
        break;
      case 1:
        newValue = '男';
        break;
      case 2:
        newValue = '女';
        break;
    }
    return newValue;
  })

Vue.filter('week', function (value) {
  if (!value) return '';
  let week = new Date(value).getDay();
  switch (week){
    case 0 :
      week = '星期天';
      break;
    case 1 :
      week = '星期一';
      break;
    case 2 :
      week = '星期二';
      break;
    case 3 :
      week = '星期三';
      break;
    case 4 :
      week = '星期四';
      break;
    case 5 :
      week = '星期五';
      break;
    case 6 :
      week = '星期六';
      break;
  }
  return week;
})
