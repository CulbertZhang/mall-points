<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { searchProducts } from '@/api/product'
import GoodsCard from '@/components/GoodsCard.vue'
import type { ProductItem } from '@/types'

const router = useRouter()
const keyword = ref('')
const products = ref<ProductItem[]>([])
const searched = ref(false)

async function onSearch(val: string) {
  if (!val.trim()) return
  const res = await searchProducts(val)
  products.value = res.data.list
  searched.value = true
}
</script>

<template>
  <div class="page-container">
    <van-search v-model="keyword" placeholder="搜索商品" @search="onSearch" show-action autofocus>
      <template #action><span @click="router.back()">取消</span></template>
    </van-search>

    <van-empty v-if="searched && products.length === 0" description="未找到相关商品" />

    <div v-if="products.length" style="display:grid; grid-template-columns:1fr 1fr; gap:8px; padding:8px 12px">
      <GoodsCard v-for="item in products" :key="item.id" :item="item" />
    </div>
  </div>
</template>
