<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getOrders } from '@/api/order'
import PageLoading from '@/components/PageLoading.vue'
import PageEmpty from '@/components/PageEmpty.vue'
import type { OrderItem } from '@/types'

const route = useRoute()
const router = useRouter()
const orders = ref<OrderItem[]>([])
const loading = ref(true)
const activeTab = ref((route.query.status as string) || 'all')

const tabs = [
  { name: 'all', label: '全部' },
  { name: 'pending_pay', label: '待付款' },
  { name: 'pending_ship', label: '待发货' },
  { name: 'pending_receipt', label: '待收货' },
  { name: 'completed', label: '已完成' },
]

async function fetchOrders() {
  loading.value = true
  try {
    const res = await getOrders({ status: activeTab.value === 'all' ? undefined : activeTab.value })
    orders.value = res.data.list
  } finally {
    loading.value = false
  }
}

function onTabChange(name: string) {
  activeTab.value = name
  fetchOrders()
}

onMounted(fetchOrders)
</script>

<template>
  <div class="page-container">
    <van-nav-bar title="我的订单" left-arrow @click-left="router.back()" />

    <van-tabs v-model:active="activeTab" @change="onTabChange">
      <van-tab v-for="t in tabs" :key="t.name" :title="t.label" :name="t.name" />
    </van-tabs>

    <PageLoading v-if="loading" />
    <PageEmpty v-else-if="orders.length === 0" message="暂无订单" actionText="去逛逛" @action="router.push('/home')" />

    <div v-else>
      <div v-for="o in orders" :key="o.orderId" class="order-card" @click="router.push(`/order/${o.orderId}`)">
        <div style="display:flex; justify-content:space-between; padding:8px 12px; font-size:12px; color:#666">
          <span>订单号: {{ o.orderNo }}</span>
          <span style="color:var(--color-primary)">{{ o.statusName }}</span>
        </div>
        <div v-for="item in o.items" :key="item.productId" style="display:flex; padding:8px 12px; border-top:1px solid #f5f5f5">
          <van-image :src="item.coverImage" width="60" height="60" fit="cover" radius="4" />
          <div style="flex:1; margin-left:10px">
            <p style="font-size:13px">{{ item.productName }}</p>
            <div style="display:flex; justify-content:space-between; margin-top:4px">
              <span class="price">¥{{ item.price }}</span>
              <span style="font-size:12px; color:#666">x{{ item.quantity }}</span>
            </div>
          </div>
        </div>
        <div style="text-align:right; padding:8px 12px; border-top:1px solid #f5f5f5">
          共 {{ o.itemCount }} 件 实付 <span class="price">¥{{ o.payAmount }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.order-card { background: #fff; margin: 8px 12px; border-radius: 8px; overflow: hidden; }
</style>
