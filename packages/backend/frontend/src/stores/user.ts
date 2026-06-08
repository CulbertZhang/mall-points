import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserInfo } from '@/types'
import { getProfile } from '@/api/auth'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('accessToken') || '')
  const userInfo = ref<UserInfo | null>(null)
  const loading = ref(false)

  const isLogin = computed(() => !!token.value)

  function setToken(t: string) {
    token.value = t
    localStorage.setItem('accessToken', t)
  }

  function clearToken() {
    token.value = ''
    localStorage.removeItem('accessToken')
    userInfo.value = null
  }

  async function fetchProfile() {
    if (!token.value) return
    loading.value = true
    try {
      const res = await getProfile()
      userInfo.value = res.data
    } catch {
      // ignore
    } finally {
      loading.value = false
    }
  }

  function logout() {
    clearToken()
  }

  return { token, userInfo, loading, isLogin, setToken, clearToken, fetchProfile, logout }
})
