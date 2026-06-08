<template>
  <div class="login-page">
    <van-nav-bar title="澄心惠享商城" />
    <div class="login-form">
      <van-field v-model="account" label="手机号" placeholder="请输入手机号" />
      <van-field v-model="password" label="密码" type="password" placeholder="请输入密码" />
      <van-button type="primary" block round :loading="loading" @click="onLogin" class="submit-btn">登录</van-button>
      <div class="links"><span @click="$router.push('/register')">还没有账号？去注册</span></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { showToast } from 'vant'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()
const account = ref('13800138000')
const password = ref('123456')
const loading = ref(false)

async function onLogin() {
  if (!account.value || !password.value) { showToast('请填写完整信息'); return }
  loading.value = true
  try {
    await auth.login(account.value, password.value)
    showToast('登录成功')
    router.replace('/member')
  } catch { /* toast handled by interceptor */ }
  finally { loading.value = false }
}
</script>

<style scoped>
.login-page { min-height: 100vh; background: #f7f8fa; }
.login-form { padding: 40px 20px; }
.submit-btn { margin-top: 24px; }
.links { text-align: center; margin-top: 16px; font-size: 13px; color: #1989fa; }
</style>
