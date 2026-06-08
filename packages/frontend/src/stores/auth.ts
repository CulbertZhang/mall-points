import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as loginApi, register as registerApi, getProfile } from '../api/auth'
import type { UserInfo } from '../types'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '')
  const user = ref<UserInfo | null>(null)
  const isLoggedIn = ref(!!token.value)

  async function login(account: string, password: string) {
    const res = await loginApi(account, password)
    const d = res.data!
    token.value = d.accessToken
    isLoggedIn.value = true
    localStorage.setItem('token', token.value)
    // transform userInfo → full profile by merging
    user.value = {
      userId: d.userInfo.userId,
      nickname: d.userInfo.nickname,
      avatar: d.userInfo.avatar,
      phone: d.userInfo.phone,
      gender: 0,
      birthday: null,
      memberLevel: d.userInfo.memberLevel,
      memberLevelName: d.userInfo.memberLevelName,
      growthValue: 0,
      pointsBalance: 0,
      couponCount: 0,
    }
  }

  async function register(phone: string, password: string, nickname?: string) {
    const res = await registerApi(phone, password, nickname)
    const d = res.data!
    token.value = d.accessToken
    isLoggedIn.value = true
    localStorage.setItem('token', token.value)
    user.value = {
      userId: d.userInfo.userId,
      nickname: d.userInfo.nickname,
      avatar: d.userInfo.avatar,
      phone: d.userInfo.phone,
      gender: 0,
      birthday: null,
      memberLevel: d.userInfo.memberLevel,
      memberLevelName: d.userInfo.memberLevelName,
      growthValue: 0,
      pointsBalance: 0,
      couponCount: 0,
    }
  }

  async function fetchProfile() {
    if (!token.value) return
    try {
      const res = await getProfile()
      user.value = res.data
    } catch {
      logout()
    }
  }

  function logout() {
    token.value = ''
    user.value = null
    isLoggedIn.value = false
    localStorage.removeItem('token')
  }

  return { token, user, isLoggedIn, login, register, fetchProfile, logout }
})
