<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const tabs = [
  { name: 'Home', label: '首页', icon: 'home-o' },
  { name: 'Categories', label: '分类', icon: 'apps-o' },
  { name: 'Cart', label: '购物车', icon: 'cart-o' },
  { name: 'Member', label: '我的', icon: 'user-o' },
]

const active = computed(() => route.name ? tabs.findIndex(t => t.name === route.name) : 0)

function onChange(idx: number) {
  router.push({ name: tabs[idx].name })
}
</script>

<template>
  <van-tabbar :model-value="active" @update:model-value="onChange" route safe-area-inset-bottom fixed>
    <van-tabbar-item v-for="tab in tabs" :key="tab.name" :icon="tab.icon">
      {{ tab.label }}
      <template v-if="tab.name === 'Cart'" #icon>
        <van-badge :content="cartStore.totalCount || ''" :max="99">
          <van-icon name="cart-o" size="22" />
        </van-badge>
      </template>
    </van-tabbar-item>
  </van-tabbar>
</template>
