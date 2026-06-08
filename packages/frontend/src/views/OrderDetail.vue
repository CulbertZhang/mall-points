<template>
  <div class="order-detail-page">
    <van-nav-bar title="订单详情" left-arrow @click-left="$router.back()" />
    <div v-if="!order" class="loading-wrap"><van-loading /></div>
    <template v-else>
      <div class="status-bar">
        <span class="status-text">{{ statusText(order.status) }}</span>
        <span class="order-no">订单号：{{ order.orderNo }}</span>
      </div>

      <div class="address-card" v-if="order.address.receiverName">
        <van-icon name="location-o" size="18" />
        <div class="address-info">
          <div class="receiver">{{ order.address.receiverName }} {{ order.address.phone }}</div>
          <div class="addr-detail">{{ order.address.province }}{{ order.address.city }}{{ order.address.district }} {{ order.address.detail }}</div>
        </div>
      </div>

      <div class="items-section">
        <div v-for="(item, idx) in order.items" :key="idx" class="order-item">
          <van-image :src="item.coverImage || ''" fit="cover" class="item-img" />
          <div class="item-info">
            <div class="item-name">{{ item.productName }}</div>
            <div class="item-bottom">
              <span class="item-price">¥{{ parseFloat(String(item.price)) }}</span>
              <span class="item-qty">x{{ item.quantity }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="amount-section">
        <div class="amount-row"><span>商品总额</span><span>¥{{ parseFloat(String(order.totalAmount)) }}</span></div>
        <div class="amount-row"><span>运费</span><span>¥{{ parseFloat(String(order.freight)) }}</span></div>
        <div class="amount-row" v-if="order.pointsUsed"><span>积分抵扣</span><span>-{{ order.pointsUsed }}积分</span></div>
        <div class="amount-row total"><span>实付款</span><span class="pay">¥{{ parseFloat(String(order.payAmount)) }}</span></div>
      </div>

      <div class="actions" v-if="order.status === 'pending_pay'">
        <van-button size="small" @click="onCancel">取消订单</van-button>
        <van-button type="danger" size="small">去支付</van-button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { showToast, showConfirmDialog } from 'vant'
import { getOrderDetail, cancelOrder } from '../api/order'
import type { OrderDetail } from '../types'

const route = useRoute()
const order = ref<OrderDetail | null>(null)

onMounted(async () => {
  const r = await getOrderDetail(Number(route.params.id))
  order.value = r.data
})

function statusText(s: string) {
  const map: Record<string, string> = {
    pending_pay: '等待付款', pending_ship: '等待发货', pending_receipt: '等待收货',
    completed: '交易完成', cancelled: '已取消',
  }
  return map[s] || s
}

async function onCancel() {
  try {
    await showConfirmDialog({ title: '提示', message: '确定取消订单吗？' })
    await cancelOrder(Number(route.params.id))
    showToast('订单已取消')
    const r = await getOrderDetail(Number(route.params.id))
    order.value = r.data
  } catch {}
}
</script>

<style scoped>
.order-detail-page { background: #f7f8fa; min-height: 100vh; }
.loading-wrap { display: flex; justify-content: center; padding: 80px 0; }
.status-bar { background: linear-gradient(135deg, #667eea, #764ba2); color: #fff; padding: 20px; }
.status-text { font-size: 18px; font-weight: 600; display: block; }
.order-no { font-size: 12px; opacity: .8; margin-top: 4px; }
.address-card { display: flex; gap: 10px; background: #fff; margin: 10px; padding: 14px; border-radius: 8px; }
.address-info { flex: 1; }
.receiver { font-size: 15px; font-weight: 500; }
.addr-detail { font-size: 13px; color: #666; margin-top: 4px; }
.items-section { background: #fff; margin: 0 10px; border-radius: 8px; }
.order-item { display: flex; padding: 12px; border-bottom: 1px solid #f5f5f5; }
.order-item:last-child { border-bottom: none; }
.item-img { width: 70px; height: 70px; border-radius: 6px; margin-right: 10px; background: #f5f5f5; flex-shrink: 0; }
.item-info { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
.item-name { font-size: 14px; color: #333; }
.item-bottom { display: flex; justify-content: space-between; }
.item-price { font-size: 15px; font-weight: 600; color: #ee0a24; }
.item-qty { font-size: 13px; color: #999; }
.amount-section { background: #fff; margin: 10px; padding: 14px; border-radius: 8px; }
.amount-row { display: flex; justify-content: space-between; font-size: 13px; color: #666; margin-bottom: 8px; }
.amount-row.total { font-size: 15px; color: #333; font-weight: 600; border-top: 1px solid #f5f5f5; padding-top: 10px; margin-top: 4px; }
.pay { color: #ee0a24; }
.actions { display: flex; justify-content: flex-end; gap: 10px; padding: 12px; }
</style>
