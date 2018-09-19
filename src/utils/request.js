import axios from 'axios'
import { Message,MessageBox } from 'element-ui'
// import { getToken } from '@/utils/auth'
import Code from '@/utils/code'

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000, // request timeout
  withCredentials: true //使前台能够保存cookie
})


// respone interceptor
service.interceptors.response.use(

  /**
   * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
   * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
   */
  res => {
    console.log("服务返回结果:"+res.status);
    if(res.status){
      //如果后台返回的json显示成功，pass
      return res;
    }else{
      if(res.data.code == Code.UNAUTHEN || res.data.code == Code.SESSION_TIMOUT){
        //处理登录相关的错误
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出',
          {confirmButtonText: '重新登录',cancelButtonText: '取消',type: 'warning'}).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload();// 为了重新实例化vue-router对象 避免bug
          });
        })
      }else{
        //其它错误弹出错误信息
        Message({ message: res.data.msg, type: 'error', duration: 5000});
      }
      return Promise.reject('error');
    }
  },

  /**
   * 请求发生错误，一般都是服务器抛异常了
   */
  err => {
    // MessageBox("骚等, 出了点状况 -_-||");
    console.error('request err: %o', err)// for debug
    Message({message: error.message,type: 'error',duration: 5000})
    return Promise.reject(error)
  }

)

export default service
