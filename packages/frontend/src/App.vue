<template>
  <div id="app-layout">
    <router-view />
    <van-tabbar v-model="activeTab" route v-show="showTabbar">
      <van-tabbar-item icon="home-o" to="/home">首页</van-tabbar-item>
      <van-tabbar-item icon="apps-o" to="/categories">分类</van-tabbar-item>
      <van-tabbar-item icon="cart-o" to="/cart" :badge="cartBadge">购物车</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/member">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useCartStore } from './stores/cart'

const route = useRoute()
const auth = useAuthStore()
const cart = useCartStore()
const activeTab = ref(0)

const hiddenRoutes = ['Login', 'Register', 'ProductDetail', 'Orders', 'OrderDetail', 'Checkout', 'Search', 'Addresses', 'AddressEdit', 'SignIn', 'PointsMall', 'Coupons', 'FlashSale', 'GroupBuy']
const showTabbar = computed(() => !hiddenRoutes.includes(route.name as string))

const cartBadge = computed(() => cart.totalCount || '')

if (auth.isLoggedIn) {
  auth.fetchProfile()
  cart.fetchCart()
}

watch(() => auth.isLoggedIn, (v) => {
  if (v) cart.fetchCart()
})
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: #333; background: #f7f8fa; -webkit-font-smoothing: antialiased; }
a { color: inherit; text-decoration: none; }
</style>
