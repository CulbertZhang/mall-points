<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import TabBar from '@/components/TabBar.vue'

const route = useRoute()
const showTabBar = computed(() => {
  const tabRoutes = ['Home', 'Categories', 'Cart', 'Member']
  return tabRoutes.includes(route.name as string)
})
</script>

<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" v-if="$route.meta.keepAlive" />
    </keep-alive>
    <component :is="Component" v-if="!$route.meta.keepAlive" />
  </router-view>
  <TabBar v-if="showTabBar" />
</template>
