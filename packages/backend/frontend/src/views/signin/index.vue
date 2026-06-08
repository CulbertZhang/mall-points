<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { signIn, getSignInStatus } from '@/api/member'
import { showToast } from 'vant'

const router = useRouter()
const signed = ref(false)
const consecutiveDays = ref(0)
const points = ref(0)
const loading = ref(false)

onMounted(async () => {
  try {
    const res = await getSignInStatus()
    signed.value = res.data.todaySigned
    consecutiveDays.value = res.data.consecutiveDays
  } catch { /* ignore */ }
})

async function doSignIn() {
  loading.value = true
  try {
    const res = await signIn()
    signed.value = true
    points.value = res.data.totalEarned
    consecutiveDays.value = res.data.consecutiveDays
    showToast(`签到成功 +${res.data.totalEarned} 积分`)
  } catch { /* handled */ }
  finally { loading.value = false }
}
</script>

<template>
  <div style="min-height:100vh; background:#fff">
    <van-nav-bar title="每日签到" left-arrow @click-left="router.back()" />

    <div style="text-align:center; padding: 40px 20px">
      <div style="font-size:48px; margin-bottom:16px">{{ signed ? '✅' : '📅' }}</div>
      <p style="font-size:18px; font-weight:600">
        {{ signed ? `已连续签到 ${consecutiveDays} 天` : '今日可签到' }}
      </p>
      <p style="color:#999; font-size:13px; margin-top:4px">
        连续第{{ Math.min(consecutiveDays + 1, 7) }}天可获得
        <span style="color:var(--color-primary)">{{ consecutiveDays >= 6 ? 50 : consecutiveDays >= 4 ? 20 : consecutiveDays >= 2 ? 15 : 10 }}</span>
        积分
      </p>

      <van-button type="primary" round size="large" :loading="loading" :disabled="signed"
        @click="doSignIn" style="margin-top:32px; width:200px">
        {{ signed ? '今日已签到' : '签到领积分' }}
      </van-button>
    </div>

    <!-- Rules -->
    <div style="padding:20px; border-top:8px solid #f5f5f5">
      <h4 style="font-size:14px; margin-bottom:8px">签到规则</h4>
      <p v-for="(rule, i) in ['连续签到第 1-2 天：+10积分', '连续签到第 3-4 天：+15积分', '连续签到第 5-6 天：+20积分', '连续签到第 7 天：+50积分（翻倍周奖励）', '中断后重新从第 1 天开始计算']" :key="i"
        style="font-size:12px; color:#666; line-height:2">
        {{ rule }}
      </p>
    </div>
  </div>
</template>
