<template>
  <div class="register-page">
    <van-nav-bar title="注册" />
    <div class="register-form">
      <van-field v-model="phone" label="手机号" placeholder="请输入手机号" />
      <van-field v-model="nickname" label="昵称" placeholder="请输入昵称（选填）" />
      <van-field v-model="password" label="密码" type="password" placeholder="请输入密码" />
      <van-field v-model="password2" label="确认密码" type="password" placeholder="请再次输入密码" />
      <van-button type="primary" block round :loading="loading" @click="onRegister" class="submit-btn">注册</van-button>
      <div class="links"><span @click="$router.push('/login')">已有账号？去登录</span></div>
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
const phone = ref('')
const nickname = ref('')
const password = ref('')
const password2 = ref('')
const loading = ref(false)

async function onRegister() {
  if (!phone.value || !password.value) { showToast('请填写完整信息'); return }
  if (password.value !== password2.value) { showToast('两次密码不一致'); return }
  loading.value = true
  try {
    await auth.register(phone.value, password.value, nickname.value || undefined)
    showToast('注册成功')
    router.replace('/member')
  } catch {}
  finally { loading.value = false }
}
</script>

<style scoped>
.register-page { min-height: 100vh; background: #f7f8fa; }
.register-form { padding: 40px 20px; }
.submit-btn { margin-top: 24px; }
.links { text-align: center; margin-top: 16px; font-size: 13px; color: #1989fa; }
</style>
