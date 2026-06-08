<template>
  <div class="product-detail-page">
    <van-nav-bar title="商品详情" left-arrow @click-left="$router.back()" />
    <template v-if="detail">
      <van-swipe :autoplay="3000" indicator-color="white" class="detail-swipe">
        <van-swipe-item v-for="(img, i) in detail.imageList" :key="i">
          <img :src="img" class="detail-swipe-img" />
        </van-swipe-item>
      </van-swipe>

      <div class="info-section">
        <div class="price-row">
          <span class="price">¥{{ parseFloat(detail.price) }}</span>
          <span class="original-price" v-if="parseFloat(detail.originalPrice) > parseFloat(detail.price)">¥{{ parseFloat(detail.originalPrice) }}</span>
          <span class="sales">已售{{ detail.salesCount }}</span>
        </div>
        <h2 class="name">{{ detail.name }}</h2>
        <p class="subtitle" v-if="detail.subtitle">{{ detail.subtitle }}</p>
      </div>

      <div class="sku-section">
        <div class="sku-label">规格</div>
        <div class="sku-list">
          <van-tag
            v-for="s in detail.skus" :key="s.skuId"
            :type="selectedSkuId === s.skuId ? 'primary' : 'default'"
            size="large" class="sku-tag"
            @click="selectSku(s)"
          >{{ s.skuName }} - ¥{{ parseFloat(s.price) }}</van-tag>
        </div>
        <div class="quantity-row">
          <span class="sku-label">数量</span>
          <van-stepper v-model="quantity" :min="1" :max="selectedSku?.stock || 1" />
        </div>
      </div>

      <div class="desc-section">
        <h3>商品详情</h3>
        <div v-if="detail.description" v-html="detail.description" />
        <van-empty v-else description="暂无详情" />
      </div>
    </template>
    <div v-else class="loading-wrap"><van-loading /></div>

    <!-- Bottom Action Bar -->
    <div class="action-bar" v-if="detail">
      <div class="action-icons">
        <div class="action-icon-item" @click="$router.push('/cart')">
          <van-icon name="cart-o" size="22" />
          <span>购物车</span>
        </div>
      </div>
      <div class="action-buttons">
        <van-button type="warning" round size="small" @click="onAddCart">加入购物车</van-button>
        <van-button type="danger" round size="small" @click="onBuyNow">立即购买</van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'
import { getProductDetail } from '../api/product'
import { addToCart } from '../api/cart'
import { useAuthStore } from '../stores/auth'
import type { ProductDetail, ProductSku } from '../types'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const detail = ref<ProductDetail | null>(null)
const selectedSkuId = ref(0)
const selectedSku = ref<ProductSku | null>(null)
const quantity = ref(1)

onMounted(async () => {
  const r = await getProductDetail(Number(route.params.id))
  detail.value = r.data
  if (r.data?.skus?.length) {
    selectedSkuId.value = r.data.skus[0].skuId
    selectedSku.value = r.data.skus[0]
  }
})

function selectSku(s: ProductSku) {
  selectedSkuId.value = s.skuId
  selectedSku.value = s
}

async function onAddCart() {
  if (!auth.isLoggedIn) { showToast('请先登录'); return }
  if (!selectedSkuId.value) return
  try {
    await addToCart(detail.value!.id, selectedSkuId.value, quantity.value)
    showToast('已加入购物车')
  } catch {}
}

function onBuyNow() {
  if (!auth.isLoggedIn) { showToast('请先登录'); return }
  if (!selectedSku.value) return
  sessionStorage.setItem('directBuyItem', JSON.stringify({
    productId: detail.value!.id,
    skuId: selectedSkuId.value,
    productName: detail.value!.name,
    skuName: selectedSku.value.skuName,
    coverImage: detail.value!.coverImage,
    price: selectedSku.value.price,
    quantity: quantity.value,
  }))
  router.push('/checkout?source=direct')
}
</script>

<style scoped>
.product-detail-page { background: #f7f8fa; padding-bottom: 60px; }
.loading-wrap { display: flex; justify-content: center; padding: 80px 0; }
.detail-swipe { margin-bottom: 8px; }
.detail-swipe-img { width: 100%; height: 320px; object-fit: cover; display: block; }
.info-section { background: #fff; padding: 16px; margin-bottom: 8px; }
.price-row { display: flex; align-items: baseline; gap: 8px; }
.price { font-size: 24px; font-weight: 700; color: #764ba2; }
.original-price { font-size: 14px; color: #999; text-decoration: line-through; }
.sales { font-size: 12px; color: #999; margin-left: auto; }
.name { font-size: 16px; font-weight: 600; color: #333; margin-top: 8px; }
.subtitle { font-size: 13px; color: #999; margin-top: 4px; }
.sku-section { background: #fff; padding: 16px; margin-bottom: 8px; }
.sku-label { font-size: 14px; color: #666; margin-bottom: 8px; }
.sku-list { display: flex; flex-wrap: wrap; gap: 8px; }
.sku-tag { cursor: pointer; }
.quantity-row { display: flex; align-items: center; gap: 12px; margin-top: 12px; }
.desc-section { background: #fff; padding: 16px; }
.desc-section h3 { font-size: 16px; margin-bottom: 12px; }
.action-bar { position: fixed; bottom: 0; left: 0; right: 0; display: flex; align-items: center; background: #fff; padding: 8px 12px; box-shadow: 0 -1px 6px rgba(0,0,0,.06); z-index: 100; }
.action-icons { display: flex; gap: 16px; margin-right: 12px; }
.action-icon-item { display: flex; flex-direction: column; align-items: center; font-size: 10px; color: #666; }
.action-buttons { display: flex; flex: 1; gap: 8px; }
.action-buttons .van-button { flex: 1; height: 40px; }
</style>
