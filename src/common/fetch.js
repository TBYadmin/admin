
import axios from 'axios'
import router from '../router/router'
import { message } from 'ant-design-vue'

// 设置通用host 前缀
// var HOST = ''
let http = axios.create({
  // withCredentials: true,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  },
  transformRequest: [function (data) {
    // TODO data transform
    // encode && distinct
    // let newData = ''
    // data.forEach( el => {
    //   if (data.hasOwnProperty(el) === true) {
    //     newData = Utils.stringUtils.concat(newData,encodeURIComponent(el), '=', encodeURIComponent(data[el]), )
    //   }
    // })
    return data
  }]
})

/**
 * ajax 异步请求封装方法
 * @param {请求方式} method String
 * @param {路径} url String
 * @param {参数} params Object
 * @param {成功回调函数} successHandler Function
 * @param {失败回调函数} errorHandler Function
 */
var fetch = (method, url, params) => new Promise((resolve, reject) => {
  http({
    method: method.toUpperCase(),
    url: url,
    data: method === 'POST' || method === 'PUT' ? JSON.stringify(params) : null,
    // params: method === 'GET' || method === 'DELETE' ? JSON.stringify(params)  : null,
    //   data:method === 'DELETE' ?JSON.stringify(params)  : null,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    }
  }).then(res => {
    // debugger
    if (res.status === 200) {
      return new Promise(resolve => resolve(res.data))
    }
  }).then(res => {

    // debugger
      if(res.success){
          switch (res.success) {
              case true:
                  resolve(res)
                  break
              default:
                  message.error(res.msg);
              // message.error('服务器响应失败, 请重新操作')
          }
      }else if(res.status){
          switch (res.status) {
              case true:
                  resolve(res)
                  break
              case false:
                  message.error(res.msg);
                      break
              default:
              message.error('服务器响应失败, 请重新操作')
          }
      }else{
          message.error(res.msg);
      }

  })
    .catch(e => {

      console.log(e)
      let res = e.response
       console.log(res)
      // let messageData = res.data.message
      switch (res.status) {
        case 500:
          message.error('服务器响应失败')
          break
        case 401:
          message.error('登录失效请先登录' );
            router.push({ name: 'login' });
          break
        case 404:
          message.error('服务器找不到该页面')
          break
        case 403:
          message.error('没权限访问该页面')
          break
        default:
          message.error('服务器响应失败, 请重新操作')
      }
      reject(res)
    })
})

export default {
  get: (url) => new Promise((resolve, reject) => fetch('GET', url, {}).then(res => resolve(res)).catch(err => reject(err))),
  post: (url, params) => new Promise((resolve, reject) => fetch('POST', url, params).then(res => resolve(res)).catch(err => reject(err))),
  put: (url, params) => new Promise((resolve, reject) => fetch('PUT', url, params).then(res => resolve(res)).catch(err => reject(err))),
  delete: (url) => new Promise((resolve, reject) => fetch('DELETE', url,{}).then(res => resolve(res)).catch(err => reject(err)))
}
