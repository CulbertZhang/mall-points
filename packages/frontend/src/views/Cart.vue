<template>
  <div class="cart-page">
    <van-nav-bar title="购物车" />
    <div v-if="cartStore.items.length === 0" class="empty-cart">
      <van-empty description="购物车是空的" />
      <van-button type="primary" round @click="$router.push('/home')">去逛逛</van-button>
    </div>
    <template v-else>
      <div class="cart-list">
        <van-swipe-cell v-for="item in cartStore.items" :key="item.cartItemId">
          <div class="cart-item">
            <van-checkbox :model-value="item.selected" @click="cartStore.toggleSelect(item.cartItemId)" />
            <van-image :src="item.coverImage" fit="cover" class="item-img" />
            <div class="item-info">
              <div class="item-name">{{ item.productName }}</div>
              <div class="item-spec" v-if="item.skuDesc">{{ item.skuDesc }}</div>
              <div class="item-bottom">
                <span class="item-price">¥{{ parseFloat(item.price) }}</span>
                <van-stepper :model-value="item.quantity" :min="1" :max="item.stock" @change="(v: number) => cartStore.update(item.cartItemId, v)" />
              </div>
              <div class="item-invalid" v-if="!item.isValid">商品已失效</div>
            </div>
          </div>
          <template #right>
            <van-button square type="danger" text="删除" class="delete-btn" @click="cartStore.remove(item.cartItemId)" />
          </template>
        </van-swipe-cell>
      </div>
      <van-submit-bar :price="cartStore.totalPrice * 100" button-text="结算" @submit="onSubmit">
        <van-checkbox :model-value="cartStore.items.every(i => i.selected)" @click="cartStore.toggleSelectAll()">全选</van-checkbox>
      </van-submit-bar>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const cartStore = useCartStore()
const auth = useAuthStore()

onMounted(() => {
  if (auth.isLoggedIn) cartStore.fetchCart()
})

function onSubmit() {
  if (cartStore.selectedItems.length === 0) {
    showToast('请选择商品')
    return
  }
  router.push('/checkout?source=cart')
}
</script>

<style scoped>
.cart-page { min-height: 100vh; background: #f7f8fa; padding-bottom: 60px; }
.empty-cart { display: flex; flex-direction: column; align-items: center; padding-top: 80px; }
.cart-list { background: #fff; }
.cart-item { display: flex; align-items: center; padding: 12px; }
.item-img { width: 80px; height: 80px; border-radius: 6px; margin: 0 10px; flex-shrink: 0; }
.item-info { flex: 1; }
.item-name { font-size: 14px; color: #333; }
.item-spec { font-size: 12px; color: #999; margin-top: 4px; }
.item-bottom { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; }
.item-price { font-size: 16px; font-weight: 700; color: #ee0a24; }
.item-invalid { font-size: 12px; color: #999; margin-top: 4px; }
.delete-btn { height: 100%; }
</style>
