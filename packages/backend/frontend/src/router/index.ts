import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/home/index.vue'),
    meta: { title: '首页', keepAlive: true },
  },
  {
    path: '/categories',
    name: 'Categories',
    component: () => import('@/views/categories/index.vue'),
    meta: { title: '分类', keepAlive: true },
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('@/views/cart/index.vue'),
    meta: { title: '购物车', keepAlive: true },
  },
  {
    path: '/member',
    name: 'Member',
    component: () => import('@/views/member/index.vue'),
    meta: { title: '会员中心', keepAlive: true, requireAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' },
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: () => import('@/views/product/index.vue'),
    meta: { title: '商品详情' },
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/search/index.vue'),
    meta: { title: '搜索' },
  },
  {
    path: '/order/confirm',
    name: 'OrderConfirm',
    component: () => import('@/views/order/confirm.vue'),
    meta: { title: '确认订单', requireAuth: true },
  },
  {
    path: '/order/:id',
    name: 'OrderDetail',
    component: () => import('@/views/order/detail.vue'),
    meta: { title: '订单详情', requireAuth: true },
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('@/views/order/list.vue'),
    meta: { title: '我的订单', requireAuth: true },
  },
  {
    path: '/address',
    name: 'Address',
    component: () => import('@/views/address/list.vue'),
    meta: { title: '收货地址', requireAuth: true },
  },
  {
    path: '/address/edit',
    name: 'AddressEdit',
    component: () => import('@/views/address/edit.vue'),
    meta: { title: '编辑地址', requireAuth: true },
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: () => import('@/views/signin/index.vue'),
    meta: { title: '每日签到', requireAuth: true },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/settings/index.vue'),
    meta: { title: '设置', requireAuth: true },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to, _from, next) => {
  document.title = (to.meta.title as string) || '会员积分商城'

  if (to.meta.requireAuth) {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      return next({ name: 'Login', query: { redirect: to.fullPath } })
    }
  }
  next()
})

export default router
