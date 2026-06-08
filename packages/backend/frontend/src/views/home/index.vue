<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { getProducts } from '@/api/product'
import PageLoading from '@/components/PageLoading.vue'
import PageError from '@/components/PageError.vue'
import GoodsCard from '@/components/GoodsCard.vue'
import type { ProductItem } from '@/types'

const router = useRouter()
const appStore = useAppStore()

const products = ref<ProductItem[]>([])
const loading = ref(true)
const error = ref(false)
const page = ref(1)
const finished = ref(false)

async function fetchData() {
  loading.value = true
  error.value = false
  try {
    await appStore.fetchHomeData()
    const res = await getProducts({ page: page.value, pageSize: 10, sortBy: 'newest' })
    products.value = page.value === 1 ? res.data.list : [...products.value, ...res.data.list]
    finished.value = res.data.list.length < 10
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

function onLoad() {
  page.value++
  fetchData()
}

function goSearch() { router.push('/search') }
function goProduct(id: number) { router.push(`/product/${id}`) }

onMounted(fetchData)
</script>

<template>
  <div class="page-container">
    <!-- Search -->
    <van-search v-model="searchText" placeholder="搜索商品" @focus="goSearch" shape="round" />

    <!-- Banner -->
    <van-swipe v-if="appStore.banners.length" :autoplay="3000" indicator-color="white" style="height: 160px">
      <van-swipe-item v-for="b in appStore.banners" :key="b.id">
        <van-image :src="b.imageUrl" width="100%" height="160" fit="cover" />
      </van-swipe-item>
    </van-swipe>

    <!-- Quick Entry (金刚区) -->
    <van-grid :column-num="5" :border="false" style="background:#fff; margin-bottom:8px">
      <van-grid-item v-for="e in appStore.homeEntries" :key="e.id"
        :text="e.name" icon="star-o" @click="router.push(e.linkValue)" />
    </van-grid>

    <!-- Product List -->
    <div style="padding: 0 12px">
      <h3 style="font-size:16px; padding: 12px 0 8px">为你推荐</h3>
      <PageLoading v-if="loading" :rows="4" />
      <PageError v-else-if="error" @retry="fetchData" />
      <div v-else style="display:grid; grid-template-columns:1fr 1fr; gap:8px">
        <GoodsCard v-for="item in products" :key="item.id" :item="item" />
      </div>
    </div>

    <div style="text-align:center; padding:16px; color:#999; font-size:12px" v-if="finished && !loading">
      已经到底了
    </div>
    <div v-if="!finished && !loading" style="text-align:center; padding:8px">
      <van-loading size="20" />
    </div>
  </div>
</template>

<script lang="ts">
const searchText = ref('')
</script>
