<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import PageLoading from '@/components/PageLoading.vue'
import PageEmpty from '@/components/PageEmpty.vue'

const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()

onMounted(() => cartStore.fetchCart())

const validItems = computed(() => cartStore.items.filter(i => i.isValid))

function goProduct(id: number) { router.push(`/product/${id}`) }

function checkout() {
  if (!userStore.isLogin) {
    router.push({ name: 'Login', query: { redirect: '/cart' } })
    return
  }
  router.push('/order/confirm')
}
</script>

<template>
  <div class="page-container">
    <van-nav-bar title="购物车" />

    <PageLoading v-if="cartStore.loading" />
    <PageEmpty v-else-if="validItems.length === 0" message="购物车还是空的" actionText="去逛逛"
      @action="router.push('/home')" />

    <template v-else>
      <div v-for="item in validItems" :key="item.cartItemId" class="cart-item" @click="goProduct(item.productId)">
        <van-image :src="item.coverImage" width="80" height="80" fit="cover" radius="6" />
        <div style="flex:1; margin-left:10px">
          <p class="goods-name">{{ item.productName }}</p>
          <p style="font-size:11px; color:#999">{{ item.skuDesc }}</p>
          <div style="display:flex; align-items:center; justify-content:space-between; margin-top:8px">
            <span class="price">¥{{ item.price }}</span>
            <div style="display:flex; align-items:center">
              <van-button size="mini" icon="minus" @click.stop="cartStore.update(item.cartItemId, Math.max(1, item.quantity - 1))" />
              <span style="margin:0 8px; min-width:20px; text-align:center">{{ item.quantity }}</span>
              <van-button size="mini" icon="plus" @click.stop="cartStore.update(item.cartItemId, item.quantity + 1)" />
            </div>
          </div>
        </div>
      </div>

      <div v-if="cartStore.items.some(i => !i.isValid)" style="padding: 12px; font-size:12px; color:#999">
        {{ cartStore.items.filter(i => !i.isValid).length }} 件商品已失效
        <van-button size="mini" plain type="danger"
          @click="cartStore.items.filter(i => !i.isValid).forEach(i => cartStore.remove(i.cartItemId))">
          清空失效
        </van-button>
      </div>
    </template>

    <!-- Bottom bar -->
    <van-submit-bar v-if="validItems.length" :price="cartStore.totalPrice * 100"
      button-text="结算" @submit="checkout" />
  </div>
</template>

<style scoped>
.cart-item { display: flex; padding: 12px; background: #fff; margin-bottom: 1px; }
</style>
