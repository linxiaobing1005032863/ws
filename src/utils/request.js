import axios from 'axios';
import store from '@/store';
import { Message } from 'element-ui'
let service = axios.create({
  baseURL: 'http://apielevator.test.bitiot.com.cn/v1', // api的base_url
  // baseURL:'http://192.168.10.151:9000/v1',
  timeout: 5000 // request timeout
});

service.interceptors.request.use(config => {
  config.headers['OS'] = '3';//操作系统
  config.headers['OS-VERSION'] = '3';//操作系统版本
  config.headers['CLIENT'] = '6000';//客户端
  config.headers['APP-VERSION'] = '1.0';//APP版本
  config.headers['DEVICE-ID'] = 'h5';//设备ID
  config.headers['DEVICE-TYPE'] = 'h5';//设备型号
  config.headers['PUSH-ID'] = '10086';//推送ID
  config.headers['Content-Type'] = 'application/json';
  // token
  if (store.getters.token) {
    config.headers['BIT-TOKEN'] = store.getters.token
  }
  // uid
  if (store.getters.uid) {
    config.headers['BIT-UID'] = store.getters.uid
  }

  return config
}, error => {
  Promise.reject(error)
})

service.interceptors.response.use(
  res => {
    if (res.data) {
      if(res.data.errorCode === 9050001) {
        store.dispatch('changeToken',null);
        Message({message:'登录已过期,请您重新登录',type:'error'})
      }else if(res.data.errorCode !== 0) {
        Message({message:res.data.errorMsg,type:'error'})
      }
    }

    return res.data || res;
  }, error => {
    Message({message:'链接错误,请检查管理员',type:'error'})
    return Promise.reject(error)
  }
)

export default service;
