<template>
  <div class="signin-page">
    <van-nav-bar title="签到有礼" left-arrow @click-left="$router.back()" />
    <div class="signin-card">
      <div class="days-label">已连续签到</div>
      <div class="days-count">{{ status?.consecutiveDays || 0 }}<span class="days-unit">天</span></div>
      <van-button
        type="primary" round size="large"
        :disabled="status?.todaySigned" :loading="signing"
        @click="onSignIn"
      >
        {{ status?.todaySigned ? '今日已签到' : '立即签到' }}
      </van-button>
      <div class="today-points" v-if="result">
        今日获得 {{ result.todayBonus }} 积分，当前余额 {{ result.balance }}
      </div>
    </div>
    <div class="rules-section">
      <h3>签到规则</h3>
      <ul>
        <li>每日签到可获得 10 积分</li>
        <li>连续签到 3 天额外奖励 15 积分</li>
        <li>连续签到 5 天额外奖励 20 积分</li>
        <li>连续签到 7 天额外奖励 50 积分</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { showToast } from 'vant'
import { getSignInStatus, signIn } from '../api/member'
import type { SignInStatus, SignInResult } from '../types'

const status = ref<SignInStatus | null>(null)
const result = ref<SignInResult | null>(null)
const signing = ref(false)

onMounted(async () => {
  const r = await getSignInStatus()
  status.value = r.data
})

async function onSignIn() {
  signing.value = true
  try {
    const r = await signIn()
    result.value = r.data
    showToast(`签到成功 +${r.data?.todayBonus}积分`)
    if (status.value) status.value.todaySigned = true
    if (r.data) status.value!.consecutiveDays = r.data.consecutiveDays
  } catch {}
  finally { signing.value = false }
}
</script>

<style scoped>
.signin-page { background: #f7f8fa; min-height: 100vh; }
.signin-card { background: linear-gradient(135deg, #667eea, #764ba2); color: #fff; text-align: center; padding: 40px 20px; }
.days-label { font-size: 14px; opacity: .8; }
.days-count { font-size: 48px; font-weight: 700; margin: 10px 0 20px; }
.days-unit { font-size: 16px; font-weight: 400; }
.today-points { margin-top: 16px; font-size: 14px; opacity: .9; }
.rules-section { padding: 16px; background: #fff; margin: 10px; border-radius: 8px; }
.rules-section h3 { font-size: 16px; margin-bottom: 10px; }
.rules-section ul { padding-left: 20px; font-size: 13px; color: #666; }
.rules-section li { margin-bottom: 6px; }
</style>
