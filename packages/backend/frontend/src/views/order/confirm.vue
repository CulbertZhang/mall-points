<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { getAddresses } from '@/api/member'
import { createOrder } from '@/api/order'
import { showToast } from 'vant'
import type { AddressItem } from '@/types'

const router = useRouter()
const cartStore = useCartStore()

const address = ref<AddressItem | null>(null)
const remark = ref('')
const usePoints = ref(false)
const pointsDeduction = ref(0)
const submitting = ref(false)

onMounted(async () => {
  await cartStore.fetchCart()
  try {
    const res = await getAddresses()
    address.value = res.data.find(a => a.isDefault) || res.data[0] || null
  } catch { /* ignore */ }
})

const totalAmount = cartStore.totalPrice
const freight = 0
const discount = usePoints.value ? pointsDeduction.value : 0
const payAmount = Math.max(totalAmount - discount + freight, 0)

async function submit() {
  if (!address.value) {
    showToast('请选择收货地址')
    return
  }
  submitting.value = true
  try {
    const res = await createOrder({
      source: 'cart',
      addressId: address.value.id,
      pointsDeduction: discount,
      remark: remark.value,
      payType: 'wechat',
    })
    showToast('订单已创建')
    router.replace(`/order/${res.data.orderId}`)
  } catch { /* handled */ }
  finally { submitting.value = false }
}
</script>

<template>
  <div style="min-height:100vh; background:#f5f5f5; padding-bottom:60px">
    <van-nav-bar title="确认订单" left-arrow @click-left="router.back()" />

    <!-- Address -->
    <div class="addr-card" @click="router.push('/address?from=order')">
      <template v-if="address">
        <div>
          <span style="font-weight:600">{{ address.receiverName }}</span>
          <span style="margin-left:12px">{{ address.phone }}</span>
        </div>
        <p style="font-size:12px; color:#666; margin-top:4px">
          {{ address.province }}{{ address.city }}{{ address.district }} {{ address.detail }}
        </p>
      </template>
      <template v-else>
        <p style="color:#999">请添加收货地址</p>
      </template>
      <van-icon name="arrow" />
    </div>

    <!-- Goods -->
    <div style="background:#fff; margin-top:8px; padding:12px">
      <div v-for="item in cartStore.items.filter(i => i.selected && i.isValid)" :key="item.cartItemId"
        style="display:flex; margin-bottom:8px">
        <van-image :src="item.coverImage" width="64" height="64" fit="cover" radius="4" />
        <div style="flex:1; margin-left:10px">
          <p style="font-size:13px">{{ item.productName }}</p>
          <p style="font-size:11px; color:#999">{{ item.skuDesc }}</p>
          <div style="display:flex; justify-content:space-between; margin-top:4px">
            <span class="price">¥{{ item.price }}</span>
            <span style="color:#666; font-size:12px">x{{ item.quantity }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Options -->
    <div style="background:#fff; margin-top:8px; padding:0 16px">
      <van-cell title="积分抵扣" :value="`可用 ${0} 积分`">
        <template #right-icon><van-switch v-model="usePoints" size="20" /></template>
      </van-cell>
      <van-field v-model="remark" label="备注" placeholder="选填：给卖家留言" />
    </div>

    <!-- Price -->
    <div style="background:#fff; margin-top:8px; padding:12px 16px">
      <div style="display:flex; justify-content:space-between; padding:4px 0; font-size:13px; color:#666">
        <span>商品总额</span><span>¥{{ totalAmount }}</span>
      </div>
      <div style="display:flex; justify-content:space-between; padding:4px 0; font-size:13px; color:#666">
        <span>运费</span><span>¥{{ freight }}</span>
      </div>
      <div v-if="discount" style="display:flex; justify-content:space-between; padding:4px 0; font-size:13px; color:var(--color-primary)">
        <span>积分抵扣</span><span>-¥{{ discount }}</span>
      </div>
      <div style="display:flex; justify-content:space-between; padding:8px 0; font-size:16px; font-weight:600; border-top:1px solid #f5f5f5; margin-top:4px">
        <span>实付金额</span><span class="price" style="font-size:18px">¥{{ payAmount }}</span>
      </div>
    </div>

    <van-submit-bar :price="payAmount * 100" button-text="提交订单" :loading="submitting" @submit="submit" />
  </div>
</template>

<style scoped>
.addr-card { display:flex; justify-content:space-between; align-items:flex-start; padding:16px; background:linear-gradient(135deg,#fff5f5,#fff); border-bottom:1px dashed #eee; }
</style>
