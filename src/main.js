import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store/store'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
Vue.use(Antd)
import { message } from 'ant-design-vue'
import axios from 'axios'
import Config from '@/config/api'
/**
 *引入iconfont
 */
import  "./assets/iconfont/iconfont.css"
import BaiduMap from 'vue-baidu-map'
/**
 * HappyScroll
 */
import { HappyScroll } from 'vue-happy-scroll'
//自定义组件名
Vue.component('happy-scroll', HappyScroll)
// 引入css
import 'vue-happy-scroll/docs/happy-scroll.css'
//引入富文本编辑器
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
Vue.use(mavonEditor)
Vue.use(BaiduMap, {
    ak: 'VqXt4r5hV3SbLvQVBeGFqcKG0PAyMTF7'    //这个地方是官方提供的ak密钥
})
let start = function () {
  // session 携带
  // axios.defaults.withCredentials = true
  // axios.get('/baseUrl.json')
  // .then(res => {
  Vue.config.productionTip = false
  // Vue.prototype.BASE_URL = res.data.baseUrl
  // Config.setHost(res.data.baseUrl)


  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
  // })
}
start()
