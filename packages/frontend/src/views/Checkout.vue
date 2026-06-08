<template>
  <div class="checkout-page">
    <van-nav-bar title="确认订单" left-arrow @click-left="$router.back()" />

    <!-- Address Section -->
    <div class="address-section" @click="selectAddress">
      <template v-if="address">
        <van-icon name="location-o" size="20" />
        <div class="address-info">
          <div class="receiver">{{ address.receiverName }} {{ address.phone }}</div>
          <div class="addr-detail">{{ address.province }}{{ address.city }}{{ address.district }} {{ address.detail }}</div>
        </div>
        <van-icon name="arrow" />
      </template>
      <template v-else>
        <van-icon name="add-o" size="20" />
        <span class="no-address">请选择收货地址</span>
        <van-icon name="arrow" />
      </template>
    </div>

    <!-- Items -->
    <div class="items-section">
      <div v-for="item in orderItems" :key="item.skuId" class="order-item">
        <van-image :src="item.coverImage" fit="cover" class="item-img" />
        <div class="item-info">
          <div class="item-name">{{ item.productName }}</div>
          <div class="item-spec" v-if="item.skuName">{{ item.skuName }}</div>
          <div class="item-bottom">
            <span class="item-price">¥{{ parseFloat(item.price) }}</span>
            <span class="item-qty">x{{ item.quantity }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Points Deduction -->
    <div class="points-section" v-if="userPoints > 0">
      <van-cell center title="使用积分抵扣">
        <template #right-icon>
          <van-switch v-model="usePoints" size="20" />
        </template>
      </van-cell>
      <van-cell v-if="usePoints" title="积分抵扣" :value="`使用 ${pointsToUse} 积分，抵 ¥${(pointsToUse / 100).toFixed(2)}`" />
    </div>

    <!-- Remark -->
    <van-cell-group>
      <van-field v-model="remark" label="备注" placeholder="选填，留言给商家" />
    </van-cell-group>

    <!-- Summary -->
    <div class="summary-section">
      <div class="summary-row"><span>商品总额</span><span>¥{{ totalAmount.toFixed(2) }}</span></div>
      <div class="summary-row"><span>运费</span><span>¥0.00</span></div>
      <div class="summary-row" v-if="usePoints"><span>积分抵扣</span><span class="discount">-¥{{ (pointsToUse / 100).toFixed(2) }}</span></div>
    </div>

    <!-- Submit Bar -->
    <van-submit-bar
      :price="payAmount * 100"
      button-text="提交订单"
      :loading="submitting"
      @submit="onSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onActivated } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { getAddresses } from '../api/member'
import { createOrder } from '../api/order'
import type { Address } from '../types'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const cart = useCartStore()

const address = ref<Address | null>(null)
const remark = ref('')
const usePoints = ref(false)
const submitting = ref(false)

const userPoints = computed(() => auth.user?.pointsBalance || 0)
const orderSource = computed(() => (route.query.source as string) || 'cart')

interface CheckoutItem {
  productId: number
  skuId: number
  productName: string
  skuName: string | null
  coverImage: string
  price: string
  quantity: number
}

const orderItems = ref<CheckoutItem[]>([])

const totalAmount = computed(() =>
  orderItems.value.reduce((s, i) => s + parseFloat(i.price) * i.quantity, 0),
)

const pointsToUse = computed(() => {
  if (!usePoints.value) return 0
  const maxDeduct = Math.floor(totalAmount.value * 100)
  return Math.min(userPoints.value, maxDeduct)
})

const payAmount = computed(() => {
  return Math.max(totalAmount.value - pointsToUse.value / 100, 0)
})

onMounted(async () => {
  // Load default address
  const r = await getAddresses()
  const list = r.data || []
  address.value = list.find(a => a.isDefault) || list[0] || null

  // Load items from cart or direct buy
  if (orderSource.value === 'cart') {
    orderItems.value = cart.selectedItems.map(i => ({
      productId: i.productId,
      skuId: i.skuId,
      productName: i.productName,
      skuName: i.skuDesc,
      coverImage: i.coverImage,
      price: i.price,
      quantity: i.quantity,
    }))
    if (orderItems.value.length === 0) {
      // Reload cart
      await cart.fetchCart()
      orderItems.value = cart.selectedItems.map(i => ({
        productId: i.productId,
        skuId: i.skuId,
        productName: i.productName,
        skuName: i.skuDesc,
        coverImage: i.coverImage,
        price: i.price,
        quantity: i.quantity,
      }))
    }
  } else {
    // Direct buy from sessionStorage
    const raw = sessionStorage.getItem('directBuyItem')
    if (raw) {
      orderItems.value = [JSON.parse(raw)]
      sessionStorage.removeItem('directBuyItem')
    }
  }
})

onActivated(() => {
  // Check if address was selected from address list
  const selected = sessionStorage.getItem('selectedAddress')
  if (selected) {
    address.value = JSON.parse(selected)
    sessionStorage.removeItem('selectedAddress')
  }
})

function selectAddress() {
  router.push('/addresses?select=1')
}

async function onSubmit() {
  if (!address.value) { showToast('请选择收货地址'); return }
  if (orderItems.value.length === 0) { showToast('没有商品'); return }

  submitting.value = true
  try {
    const data: any = {
      source: orderSource.value,
      addressId: address.value.id,
      payType: 'online',
      remark: remark.value || undefined,
      pointsDeduction: pointsToUse.value || undefined,
    }
    if (orderSource.value !== 'cart') {
      data.items = orderItems.value.map(i => ({
        productId: i.productId,
        skuId: i.skuId,
        quantity: i.quantity,
      }))
    }

    const res = await createOrder(data)
    showToast('下单成功')
    if (orderSource.value === 'cart') cart.fetchCart()
    router.replace(`/order/${res.data?.orderId}`)
  } catch {}
  finally { submitting.value = false }
}
</script>

<style scoped>
.checkout-page { background: #f7f8fa; min-height: 100vh; padding-bottom: 70px; }
.address-section { display: flex; align-items: center; gap: 10px; background: #fff; padding: 14px; margin-bottom: 8px; }
.address-info { flex: 1; }
.receiver { font-size: 15px; font-weight: 500; }
.addr-detail { font-size: 13px; color: #666; margin-top: 4px; }
.no-address { font-size: 14px; color: #999; flex: 1; }
.items-section { background: #fff; margin-bottom: 8px; }
.order-item { display: flex; padding: 12px; border-bottom: 1px solid #f5f5f5; }
.order-item:last-child { border-bottom: none; }
.item-img { width: 70px; height: 70px; border-radius: 6px; margin-right: 10px; flex-shrink: 0; }
.item-info { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
.item-name { font-size: 14px; color: #333; }
.item-spec { font-size: 12px; color: #999; }
.item-bottom { display: flex; justify-content: space-between; }
.item-price { font-size: 15px; font-weight: 600; color: #ee0a24; }
.item-qty { font-size: 13px; color: #999; }
.points-section { margin-bottom: 8px; }
.summary-section { background: #fff; padding: 14px; margin: 8px 0; }
.summary-row { display: flex; justify-content: space-between; font-size: 13px; color: #666; margin-bottom: 6px; }
.discount { color: #ee0a24; }
</style>
