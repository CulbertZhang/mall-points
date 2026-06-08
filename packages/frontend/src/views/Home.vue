<template>
  <div class="home-page">
    <!-- Search Bar -->
    <div class="search-bar" @click="$router.push('/search')">
      <van-icon name="search" />
      <span class="search-placeholder">搜索权益商品</span>
    </div>

    <van-swipe class="banner-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="b in banners" :key="b.id" @click="$router.push(b.linkValue || '/home')">
        <img :src="b.imageUrl" class="banner-img" />
      </van-swipe-item>
    </van-swipe>

    <van-grid :column-num="5" :border="false" class="nav-grid">
      <van-grid-item v-for="n in navItems" :key="n.id" :text="n.name" @click="onNavClick(n)">
        <template #icon>
          <span class="nav-icon">{{ navIcons[n.name] || '📦' }}</span>
        </template>
      </van-grid-item>
    </van-grid>

    <div class="section-header"><span>热门权益</span></div>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list v-model:loading="loading" :finished="finished" @load="onLoad">
        <div class="product-grid">
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
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getBanners, getNavigations } from '../api/config'
import { getProducts } from '../api/product'
import type { Banner, NavItem, Product } from '../types'

const router = useRouter()

const navIcons: Record<string, string> = {
  '每日签到': '🎁', '积分兑换': '⭐', '视频会员': '🎬', '音乐会员': '🎵', '工具特惠': '🔧',
}

const banners = ref<Banner[]>([])
const navItems = ref<NavItem[]>([])
const products = ref<Product[]>([])
const refreshing = ref(false)
const loading = ref(false)
const finished = ref(false)
const page = ref(1)

getBanners().then(r => banners.value = r.data || [])
getNavigations('home').then(r => navItems.value = r.data || [])

function onNavClick(n: NavItem) {
  if (n.linkValue?.startsWith('/')) router.push(n.linkValue)
}

function onRefresh() {
  page.value = 1
  finished.value = false
  getProducts({ page: 1 }).then(r => {
    products.value = r.data?.list || []
    refreshing.value = false
  })
}
function onLoad() {
  loading.value = true
  getProducts({ page: page.value }).then(r => {
    const list = r.data?.list || []
    products.value.push(...list)
    loading.value = false
    page.value++
    if (list.length < 20) finished.value = true
  }).catch(() => loading.value = false)
}
</script>

<style scoped>
.home-page { padding-bottom: 10px; }
.search-bar { display: flex; align-items: center; gap: 8px; margin: 8px; padding: 10px 14px; background: #fff; border-radius: 20px; box-shadow: 0 1px 4px rgba(0,0,0,.06); }
.search-placeholder { font-size: 14px; color: #999; }
.banner-swipe { margin-bottom: 8px; }
.banner-img { width: 100%; height: 180px; object-fit: cover; display: block; }
.nav-grid { background: #fff; margin-bottom: 8px; }
.nav-icon { font-size: 24px; }
.section-header { padding: 12px 16px; font-size: 16px; font-weight: 600; color: #333; background: #fff; margin-bottom: 8px; }
.product-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 0 8px; }
.product-card { background: #fff; border-radius: 8px; overflow: hidden; }
.product-img { width: 100%; height: 180px; }
.product-info { padding: 8px; }
.product-name { font-size: 14px; font-weight: 500; color: #333; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.product-subtitle { font-size: 12px; color: #999; margin-top: 2px; }
.product-bottom { display: flex; justify-content: space-between; align-items: center; margin-top: 6px; }
.product-price { font-size: 16px; font-weight: 700; color: #764ba2; }
.product-sales { font-size: 11px; color: #999; }
</style>
