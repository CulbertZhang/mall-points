<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getOrderDetail, cancelOrder } from '@/api/order'
import PageLoading from '@/components/PageLoading.vue'
import { showToast, showDialog } from 'vant'

const route = useRoute()
const router = useRouter()
const order = ref<any>(null)
const loading = ref(true)

async function fetchData() {
  loading.value = true
  try {
    const res = await getOrderDetail(Number(route.params.id))
    order.value = res.data
  } finally {
    loading.value = false
  }
}

async function handleCancel() {
  try {
    await showDialog({ title: '提示', message: '确定取消订单吗？' })
    await cancelOrder(order.value.orderId)
    showToast('订单已取消')
    fetchData()
  } catch { /* cancelled */ }
}

onMounted(fetchData)
</script>

<template>
  <div style="min-height:100vh; background:#f5f5f5; padding-bottom:60px">
    <van-nav-bar title="订单详情" left-arrow @click-left="router.back()" />

    <PageLoading v-if="loading" />

    <template v-else-if="order">
      <div style="background:#fff; padding:20px; text-align:center; margin-bottom:8px">
        <p style="font-size:18px; font-weight:600; color:var(--color-primary)">{{ order.status === 'pending_pay' ? '等待付款' : order.status === 'pending_ship' ? '待发货' : order.status === 'pending_receipt' ? '待收货' : order.status }}</p>
        <p class="price" style="font-size:24px; margin-top:8px">¥{{ order.payAmount }}</p>
      </div>

      <div style="background:#fff; padding:12px; margin-bottom:8px">
        <p style="font-size:13px; font-weight:500; margin-bottom:8px">收货地址</p>
        <p style="font-size:13px">{{ order.address?.receiverName }} {{ order.address?.phone }}</p>
        <p style="font-size:12px; color:#666">{{ order.address?.province }}{{ order.address?.city }}{{ order.address?.district }} {{ order.address?.detail }}</p>
      </div>

      <div style="background:#fff; padding:12px; margin-bottom:8px">
        <p style="font-size:13px; font-weight:500; margin-bottom:8px">商品信息</p>
        <div v-for="item in order.items" :key="item.productId" style="display:flex; margin-bottom:8px">
          <van-image :src="item.coverImage" width="64" height="64" fit="cover" radius="4" />
          <div style="flex:1; margin-left:10px">
            <p style="font-size:13px">{{ item.productName }}</p>
            <div style="display:flex; justify-content:space-between">
              <span class="price">¥{{ item.price }}</span>
              <span style="font-size:12px; color:#666">x{{ item.quantity }}</span>
            </div>
          </div>
        </div>
      </div>

      <div style="background:#fff; padding:12px; margin-bottom:8px; font-size:13px; color:#666">
        <p>订单编号：{{ order.orderNo }}</p>
        <p style="margin-top:4px">创建时间：{{ order.createdAt }}</p>
        <p v-if="order.pointsUsed" style="margin-top:4px">积分抵扣：{{ order.pointsUsed }} 积分</p>
      </div>

      <div v-if="order.status === 'pending_pay'" style="padding:12px; display:flex; gap:8px; justify-content:flex-end">
        <van-button plain @click="handleCancel">取消订单</van-button>
        <van-button type="primary">去支付</van-button>
      </div>
    </template>
  </div>
</template>
