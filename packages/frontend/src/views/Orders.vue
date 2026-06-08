<template>
  <div class="orders-page">
    <van-nav-bar title="我的订单" left-arrow @click-left="$router.back()" />
    <van-tabs v-model:active="activeTab" @change="onTabChange">
      <van-tab title="全部" name="" />
      <van-tab title="待付款" name="pending_pay" />
      <van-tab title="待发货" name="pending_ship" />
      <van-tab title="待收货" name="pending_receipt" />
      <van-tab title="已完成" name="completed" />
    </van-tabs>
    <van-list v-model:loading="loading" :finished="finished" @load="onLoad">
      <div v-for="o in orders" :key="o.orderId" class="order-card" @click="$router.push(`/order/${o.orderId}`)">
        <div class="order-header">
          <span class="order-no">{{ o.orderNo }}</span>
          <span class="order-status">{{ o.statusName }}</span>
        </div>
        <div v-for="(item, idx) in o.items" :key="idx" class="order-item">
          <van-image :src="item.coverImage || ''" fit="cover" class="item-img" />
          <div class="item-info">
            <div class="item-name">{{ item.productName }}</div>
            <div class="item-bottom">
              <span class="item-price">¥{{ parseFloat(String(item.price)) }}</span>
              <span class="item-qty">x{{ item.quantity }}</span>
            </div>
          </div>
        </div>
        <div class="order-footer">
          <span>共{{ o.itemCount }}件商品 实付 <b class="pay-amount">¥{{ parseFloat(String(o.payAmount)) }}</b></span>
        </div>
      </div>
    </van-list>
    <van-empty v-if="!loading && orders.length === 0" description="暂无订单" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getOrders } from '../api/order'
import type { OrderListItem } from '../types'

const activeTab = ref('')
const orders = ref<OrderListItem[]>([])
const loading = ref(false)
const finished = ref(false)
const page = ref(1)

function onTabChange() {
  page.value = 1
  orders.value = []
  finished.value = false
}

function onLoad() {
  loading.value = true
  getOrders({ page: page.value, status: activeTab.value || undefined }).then(r => {
    const list = r.data?.list || []
    orders.value.push(...list)
    loading.value = false
    page.value++
    if (list.length < 20) finished.value = true
  }).catch(() => { loading.value = false; finished.value = true })
}
</script>

<style scoped>
.orders-page { background: #f7f8fa; min-height: 100vh; }
.order-card { background: #fff; margin: 10px; border-radius: 8px; padding: 12px; }
.order-header { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px; }
.order-no { color: #666; }
.order-status { color: #ee0a24; font-weight: 500; }
.order-item { display: flex; padding: 8px 0; border-top: 1px solid #f5f5f5; }
.item-img { width: 70px; height: 70px; border-radius: 6px; margin-right: 10px; background: #f5f5f5; flex-shrink: 0; }
.item-info { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
.item-name { font-size: 14px; color: #333; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.item-bottom { display: flex; justify-content: space-between; }
.item-price { font-size: 15px; font-weight: 600; color: #ee0a24; }
.item-qty { font-size: 13px; color: #999; }
.order-footer { text-align: right; font-size: 13px; color: #666; padding-top: 8px; border-top: 1px solid #f5f5f5; }
.pay-amount { font-size: 16px; color: #ee0a24; }
</style>
