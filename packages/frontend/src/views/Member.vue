<template>
  <div class="member-page">
    <div class="member-header" @click="toLogin">
      <van-image v-if="auth.user?.avatar" :src="auth.user.avatar" fit="cover" class="avatar" />
      <van-icon v-else name="user-circle-o" size="60" color="rgba(255,255,255,.5)" />
      <div class="user-info" v-if="auth.isLoggedIn && auth.user">
        <div class="nickname">{{ auth.user.nickname || auth.user.phone }}</div>
        <div class="level"><van-tag type="warning" size="small">{{ auth.user.memberLevelName }}</van-tag></div>
      </div>
      <div v-else class="login-hint">点击登录</div>
    </div>

    <div class="stats-row" v-if="auth.isLoggedIn && auth.user">
      <div class="stat-item">
        <div class="stat-val">{{ auth.user.pointsBalance }}</div>
        <div class="stat-label">积分余额</div>
      </div>
      <div class="stat-item">
        <div class="stat-val">{{ auth.user.growthValue }}</div>
        <div class="stat-label">成长值</div>
      </div>
      <div class="stat-item">
        <div class="stat-val" v-if="auth.user.memberLevel">{{ lvDiscount }}折</div>
        <div class="stat-val" v-else>-</div>
        <div class="stat-label">会员折扣</div>
      </div>
    </div>

    <van-cell-group inset>
      <van-cell title="我的订单" is-link to="/orders" icon="orders-o" />
      <van-cell title="每日签到" is-link to="/signin" icon="gift-o" />
      <van-cell title="积分兑换" is-link to="/points-mall" icon="gold-coin-o" />
      <van-cell title="我的权益" is-link to="/coupons" icon="coupon-o" />
      <van-cell title="账户设置" is-link to="/addresses" icon="setting-o" />
    </van-cell-group>

    <div class="logout-btn" v-if="auth.isLoggedIn">
      <van-button block round type="default" @click="onLogout">退出登录</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showConfirmDialog } from 'vant'
import { useAuthStore } from '../stores/auth'
import type { MemberProfile } from '../types'
import { getMemberProfile } from '../api/member'

const auth = useAuthStore()
const router = useRouter()
const memberData = ref<MemberProfile | null>(null)

if (auth.isLoggedIn) {
  auth.fetchProfile()
  getMemberProfile().then(r => memberData.value = r.data)
}

const lvDiscount = computed(() => {
  if (!memberData.value) return ''
  const lv = memberData.value.allLevels.find(l => l.level === auth.user?.memberLevel)
  return lv ? (parseFloat(lv.discountRate) * 10).toFixed(1) : ''
})

function toLogin() {
  if (!auth.isLoggedIn) router.push('/login')
}

async function onLogout() {
  try {
    await showConfirmDialog({ title: '提示', message: '确定退出登录吗？' })
    auth.logout()
  } catch { /* cancelled */ }
}
</script>

<style scoped>
.member-page { min-height: 100vh; background: #f7f8fa; }
.member-header { display: flex; align-items: center; padding: 30px 20px; background: linear-gradient(135deg, #667eea, #764ba2); color: #fff; }
.avatar { width: 60px; height: 60px; border-radius: 50%; border: 2px solid rgba(255,255,255,.5); margin-right: 14px; }
.nickname { font-size: 18px; font-weight: 600; }
.level { margin-top: 4px; }
.login-hint { font-size: 18px; }
.stats-row { display: flex; background: #fff; padding: 16px 0; margin-bottom: 10px; }
.stat-item { flex: 1; text-align: center; }
.stat-val { font-size: 18px; font-weight: 700; color: #667eea; }
.stat-label { font-size: 12px; color: #999; margin-top: 4px; }
.logout-btn { padding: 20px; }
</style>
