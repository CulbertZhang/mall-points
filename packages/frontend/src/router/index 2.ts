import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      name: 'Home',
      component: () => import('../views/Home.vue'),
      meta: { title: '首页' },
    },
    {
      path: '/categories',
      name: 'Categories',
      component: () => import('../views/Categories.vue'),
      meta: { title: '分类' },
    },
    {
      path: '/cart',
      name: 'Cart',
      component: () => import('../views/Cart.vue'),
      meta: { title: '购物车', needAuth: true },
    },
    {
      path: '/member',
      name: 'Member',
      component: () => import('../views/Member.vue'),
      meta: { title: '我的' },
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue'),
      meta: { title: '登录' },
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/Register.vue'),
      meta: { title: '注册' },
    },
    {
      path: '/product/:id',
      name: 'ProductDetail',
      component: () => import('../views/ProductDetail.vue'),
      meta: { title: '商品详情' },
    },
    {
      path: '/orders',
      name: 'Orders',
      component: () => import('../views/Orders.vue'),
      meta: { title: '我的订单', needAuth: true },
    },
    {
      path: '/order/:id',
      name: 'OrderDetail',
      component: () => import('../views/OrderDetail.vue'),
      meta: { title: '订单详情', needAuth: true },
    },
    {
      path: '/checkout',
      name: 'Checkout',
      component: () => import('../views/Checkout.vue'),
      meta: { title: '确认订单', needAuth: true },
    },
    {
      path: '/signin',
      name: 'SignIn',
      component: () => import('../views/SignIn.vue'),
      meta: { title: '签到有礼', needAuth: true },
    },
    {
      path: '/addresses',
      name: 'Addresses',
      component: () => import('../views/AddressList.vue'),
      meta: { title: '收货地址', needAuth: true },
    },
    {
      path: '/address/edit/:id?',
      name: 'AddressEdit',
      component: () => import('../views/AddressEdit.vue'),
      meta: { title: '编辑地址', needAuth: true },
    },
    {
      path: '/points-mall',
      name: 'PointsMall',
      component: () => import('../views/PointsMall.vue'),
      meta: { title: '积分商城' },
    },
    {
      path: '/coupons',
      name: 'Coupons',
      component: () => import('../views/Coupons.vue'),
      meta: { title: '领券中心' },
    },
    {
      path: '/flash-sale',
      name: 'FlashSale',
      component: () => import('../views/FlashSale.vue'),
      meta: { title: '限时秒杀' },
    },
    {
      path: '/group-buy',
      name: 'GroupBuy',
      component: () => import('../views/GroupBuy.vue'),
      meta: { title: '拼团专区' },
    },
  ],
})

router.beforeEach((to, _from, next) => {
  document.title = (to.meta.title as string) || '商城会员积分系统'
  const token = localStorage.getItem('token')
  if (to.meta.needAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
