<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { ProductItem } from '@/types'

const props = defineProps<{ item: ProductItem }>()
const router = useRouter()

function goDetail() {
  router.push(`/product/${props.item.id}`)
}
</script>

<template>
  <div class="goods-card" @click="goDetail">
    <van-image :src="item.coverImage" width="100%" height="172" fit="cover" radius="8" />
    <div class="goods-info">
      <p class="goods-name">{{ item.name }}</p>
      <p class="goods-subtitle" v-if="item.subtitle">{{ item.subtitle }}</p>
      <div class="goods-footer">
        <span class="price">¥{{ item.price }}</span>
        <span class="price--original" v-if="item.originalPrice">¥{{ item.originalPrice }}</span>
        <span style="font-size:11px; color:#999; margin-left:auto">已售{{ item.salesCount }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.goods-card { background: #fff; border-radius: 8px; overflow: hidden; }
.goods-info { padding: 8px; }
.goods-name { font-size: 13px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.goods-subtitle { font-size: 11px; color: #999; margin-top: 2px; }
.goods-footer { display: flex; align-items: baseline; gap: 4px; margin-top: 6px; font-size: 14px; }
</style>
