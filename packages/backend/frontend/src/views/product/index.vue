<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProductDetail } from '@/api/product'
import { useCartStore } from '@/stores/cart'
import type { ProductDetail } from '@/types'
import PageLoading from '@/components/PageLoading.vue'
import PageError from '@/components/PageError.vue'
import { showToast } from 'vant'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const product = ref<ProductDetail | null>(null)
const loading = ref(true)
const error = ref(false)
const showSku = ref(false)
const buyCount = ref(1)

async function fetchData() {
  loading.value = true
  error.value = false
  try {
    const res = await getProductDetail(Number(route.params.id))
    product.value = res.data
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

async function addCart() {
  if (!product.value?.skus.length) return
  const sku = product.value.skus[0]
  await cartStore.add(product.value.id, sku.skuId, buyCount.value)
  showToast('已加入购物车')
  showSku.value = false
}

function buyNow() {
  showSku.value = true
}

onMounted(fetchData)
</script>

<template>
  <div style="min-height:100vh; background:#fff; padding-bottom:60px">
    <van-nav-bar title="商品详情" left-arrow @click-left="router.back()" />

    <PageLoading v-if="loading" :rows="5" />
    <PageError v-else-if="error" @retry="fetchData" />

    <template v-else-if="product">
      <van-swipe :autoplay="3000" style="height:375px">
        <van-swipe-item v-for="(img, i) in product.imageList" :key="i">
          <van-image :src="img" width="100%" height="375" fit="cover" />
        </van-swipe-item>
      </van-swipe>

      <div style="padding:12px 16px">
        <div style="display:flex; align-items:baseline; gap:8px">
          <span class="price" style="font-size:24px">¥{{ product.price }}</span>
          <span class="price--original" v-if="product.originalPrice">¥{{ product.originalPrice }}</span>
        </div>
        <h3 style="font-size:16px; margin-top:8px">{{ product.name }}</h3>
        <p style="font-size:12px; color:#999; margin-top:4px">{{ product.subtitle }}</p>
        <p style="font-size:11px; color:#999; margin-top:4px">已售 {{ product.salesCount }} 件</p>
      </div>

      <div style="padding: 16px; border-top:8px solid #f5f5f5" v-html="product.description || '<p>暂无详情</p>'" />
    </template>

    <!-- Bottom bar -->
    <van-action-bar>
      <van-action-bar-icon icon="cart-o" text="购物车" @click="router.push('/cart')" />
      <van-action-bar-icon icon="star-o" text="收藏" />
      <van-action-bar-button type="warning" text="加入购物车" @click="addCart" />
      <van-action-bar-button type="danger" text="立即购买" @click="buyNow" />
    </van-action-bar>
  </div>
</template>
