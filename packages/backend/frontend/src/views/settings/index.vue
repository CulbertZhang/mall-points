<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { showDialog, showToast } from 'vant'

const router = useRouter()
const userStore = useUserStore()

function logout() {
  showDialog({ title: '提示', message: '确定退出登录？' }).then(() => {
    userStore.logout()
    showToast('已退出登录')
    router.replace('/home')
  }).catch(() => {})
}
</script>

<template>
  <div style="min-height:100vh; background:#f5f5f5">
    <van-nav-bar title="设置" left-arrow @click-left="router.back()" />

    <van-cell-group style="margin-top:8px">
      <van-cell title="个人信息" is-link />
      <van-cell title="账号安全" is-link />
      <van-cell title="消息通知" is-link />
      <van-cell title="隐私设置" is-link />
    </van-cell-group>

    <van-cell-group style="margin-top:8px">
      <van-cell title="清除缓存" is-link value="0.0MB" />
      <van-cell title="关于我们" is-link />
    </van-cell-group>

    <div style="padding: 24px 16px">
      <van-button block type="danger" @click="logout">退出登录</van-button>
    </div>
  </div>
</template>
