import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { BannerItem, NavItem } from '@/types'
import { getBanners, getNavigations } from '@/api/config'

export const useAppStore = defineStore('app', () => {
  const banners = ref<BannerItem[]>([])
  const homeEntries = ref<NavItem[]>([])

  async function fetchHomeData() {
    const [bRes, nRes] = await Promise.all([
      getBanners(),
      getNavigations('home'),
    ])
    banners.value = bRes.data
    homeEntries.value = nRes.data
  }

  return { banners, homeEntries, fetchHomeData }
})
