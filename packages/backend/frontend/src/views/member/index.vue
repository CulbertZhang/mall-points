<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import PageLoading from '@/components/PageLoading.vue'

const router = useRouter()
const userStore = useUserStore()

onMounted(() => userStore.fetchProfile())

const orderBadges = [
  { icon: 'balance-o', label: '待付款', status: 'pending_pay' },
  { icon: 'logistics', label: '待发货', status: 'pending_ship' },
  { icon: 'cart-o', label: '待收货', status: 'pending_receipt' },
  { icon: 'comment-o', label: '待评价', status: 'pending_comment' },
  { icon: 'after-sale', label: '退款/售后', status: 'refund' },
]

const tools = [
  { icon: 'location-o', label: '收货地址', route: '/address' },
  { icon: 'coupon-o', label: '我的优惠券', route: '/coupons' },
  { icon: 'points', label: '积分商城', route: '/points-mall' },
  { icon: 'sign', label: '每日签到', route: '/signin' },
  { icon: 'clock-o', label: '限时秒杀', route: '/flash-sale' },
  { icon: 'friends-o', label: '拼团专区', route: '/group-buy' },
  { icon: 'setting-o', label: '设置', route: '/settings' },
]
</script>

<template>
  <div class="page-container">
    <!-- Profile Header -->
    <template v-if="userStore.isLogin && userStore.userInfo">
      <div class="member-header">
        <van-image :src="userStore.userInfo.avatar || ''" width="56" height="56" round />
        <div style="flex:1; margin-left:12px">
          <p style="font-size:16px; font-weight:600">{{ userStore.userInfo.nickname }}</p>
          <van-tag type="warning" style="margin-top:4px">
            {{ userStore.userInfo.memberLevelName }}
          </van-tag>
        </div>
      </div>

      <!-- Assets -->
      <div class="asset-bar">
        <div class="asset-item">
          <span class="asset-val">{{ userStore.userInfo.pointsBalance }}</span>
          <span class="asset-label">积分</span>
        </div>
        <div class="asset-item">
          <span class="asset-val">{{ userStore.userInfo.growthValue }}</span>
          <span class="asset-label">成长值</span>
        </div>
        <div class="asset-item">
          <span class="asset-val">{{ userStore.userInfo.couponCount }}</span>
          <span class="asset-label">优惠券</span>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="member-header" @click="router.push('/login')">
        <van-image src="" width="56" height="56" round />
        <div style="flex:1; margin-left:12px; font-size:16px; color:#999">点击登录</div>
      </div>
    </template>

    <!-- Orders -->
    <div class="section-card">
      <div class="section-header" @click="router.push('/orders')">
        <span>我的订单</span>
        <van-icon name="arrow" />
      </div>
      <van-grid :column-num="5" :border="false">
        <van-grid-item v-for="b in orderBadges" :key="b.status" :icon="b.icon" :text="b.label"
          @click="router.push({ path: '/orders', query: { status: b.status } })" />
      </van-grid>
    </div>

    <!-- Tools -->
    <div class="section-card">
      <van-grid :column-num="4" :border="false">
        <van-grid-item v-for="t in tools" :key="t.label" :icon="t.icon" :text="t.label"
          @click="router.push(t.route)" />
      </van-grid>
    </div>

    <PageLoading v-if="userStore.loading" />
  </div>
</template>

<style scoped>
.member-header { display: flex; align-items: center; padding: 24px 16px; background: linear-gradient(135deg, #ff6b6b, #ff4d4f); color: #fff; }
.asset-bar { display: flex; background: #fff; margin: -8px 12px 0; border-radius: 8px; padding: 12px 0; box-shadow: 0 2px 8px rgba(0,0,0,.06); position: relative; }
.asset-item { flex: 1; text-align: center; display: flex; flex-direction: column; }
.asset-val { font-size: 20px; font-weight: 700; color: var(--color-primary); }
.asset-label { font-size: 11px; color: #999; margin-top: 2px; }
.section-card { background: #fff; margin: 12px; border-radius: 8px; overflow: hidden; }
.section-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #f5f5f5; font-size: 15px; font-weight: 500; }
</style>
