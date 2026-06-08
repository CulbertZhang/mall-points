<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { login, register } from '@/api/auth'
import { showToast } from 'vant'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const isLogin = ref(true)
const phone = ref('13800138000')
const password = ref('123456')
const loading = ref(false)

async function submit() {
  if (!phone.value || !password.value) {
    showToast('请输入手机号和密码')
    return
  }
  loading.value = true
  try {
    const fn = isLogin.value ? login : register
    const res = await fn(phone.value, password.value)
    userStore.setToken(res.data.accessToken)
    await userStore.fetchProfile()
    showToast(isLogin.value ? '登录成功' : '注册成功')
    const redirect = (route.query.redirect as string) || '/home'
    router.replace(redirect)
  } catch {
    // error handled by interceptor
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div style="padding: 60px 24px; min-height:100vh; background:#fff">
    <h2 style="font-size:24px; margin-bottom:8px">{{ isLogin ? '欢迎回来' : '注册账号' }}</h2>
    <p style="color:#999; margin-bottom:32px; font-size:13px">{{ isLogin ? '登录您的会员账号' : '注册后即可享受会员权益' }}</p>

    <van-field v-model="phone" label="手机号" placeholder="请输入手机号" type="tel" maxlength="11" />
    <van-field v-model="password" label="密码" placeholder="请输入密码（6-20位）" type="password" />

    <van-button type="primary" block round :loading="loading" @click="submit" style="margin-top:32px">
      {{ isLogin ? '登录' : '注册' }}
    </van-button>

    <div style="text-align:center; margin-top:16px">
      <span style="color:var(--color-primary); font-size:13px" @click="isLogin = !isLogin">
        {{ isLogin ? '没有账号？去注册' : '已有账号？去登录' }}
      </span>
    </div>

    <p style="text-align:center; color:#999; font-size:11px; margin-top:24px">
      演示账号: 13800138000 / 123456
    </p>
  </div>
</template>
