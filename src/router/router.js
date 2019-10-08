import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login.vue')
  },
  {
    path: '/manageCenter',
    name: 'main',
    component: () => import('@/views/manageCenter.vue'),
    // children: [
    //   {
    //     path: '/orderManage',
    //     name: 'orderManage',
    //     component: () => import('@/views/manage/order.vue')
    //   },
    //   {
    //     path: '/qualification',
    //     name: 'qualification',
    //     component: () => import('@/views/manage/qualification.vue')
    //   },
    //   {
    //     path: '/goods',
    //     name: 'goods',
    //     component: () => import('@/views/manage/goods.vue')
    //   },
    //   {
    //     path: '/picture',
    //     name: 'picture',
    //     component: () => import('@/views/manage/picture.vue')
    //   },
    //   {
    //     path: '/coupon',
    //     name: 'coupon',
    //     component: () => import('@/views/manage/coupon.vue')
    //   },
    //   {
    //     path: '/activity',
    //     name: 'activity',
    //     component: () => import('@/views/manage/activity.vue')
    //   }
    // ]
  }
  ]
})
