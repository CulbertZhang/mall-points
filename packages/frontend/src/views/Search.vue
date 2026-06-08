<template>
  <div class="search-page">
    <form action="/" @submit.prevent="onSearch">
      <van-search v-model="keyword" placeholder="搜索商品" show-action autofocus @search="onSearch" @cancel="$router.back()" />
    </form>
    <van-list v-if="searched" v-model:loading="loading" :finished="finished" @load="onLoad">
      <div class="product-grid" v-if="products.length">
        <div v-for="p in products" :key="p.id" class="product-card" @click="$router.push(`/product/${p.id}`)">
          <van-image :src="p.coverImage" fit="cover" class="product-img" />
          <div class="product-info">
            <div class="product-name">{{ p.name }}</div>
            <div class="product-subtitle">{{ p.subtitle }}</div>
            <div class="product-bottom">
              <span class="product-price">¥{{ parseFloat(p.price) }}</span>
              <span class="product-sales">已售{{ p.salesCount }}</span>
            </div>
          </div>
        </div>
      </div>
      <van-empty v-if="!loading && products.length === 0" description="没有找到相关商品" />
    </van-list>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getProducts } from '../api/product'
import type { Product } from '../types'

const keyword = ref('')
const products = ref<Product[]>([])
const loading = ref(false)
const finished = ref(false)
const searched = ref(false)
const page = ref(1)

function onSearch() {
  if (!keyword.value.trim()) return
  searched.value = true
  page.value = 1
  products.value = []
  finished.value = false
  onLoad()
}

function onLoad() {
  if (!keyword.value.trim()) return
  loading.value = true
  getProducts({ keyword: keyword.value.trim(), page: page.value, pageSize: 20 }).then(r => {
    const list = r.data?.list || []
    products.value.push(...list)
    loading.value = false
    page.value++
    if (list.length < 20) finished.value = true
  }).catch(() => { loading.value = false; finished.value = true })
}
</script>

<style scoped>
.search-page { min-height: 100vh; background: #f7f8fa; }
.product-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 8px; }
.product-card { background: #fff; border-radius: 8px; overflow: hidden; }
.product-img { width: 100%; height: 160px; }
.product-info { padding: 8px; }
.product-name { font-size: 14px; font-weight: 500; color: #333; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.product-subtitle { font-size: 12px; color: #999; margin-top: 2px; }
.product-bottom { display: flex; justify-content: space-between; margin-top: 6px; }
.product-price { font-size: 16px; font-weight: 700; color: #ee0a24; }
.product-sales { font-size: 11px; color: #999; }
</style>
