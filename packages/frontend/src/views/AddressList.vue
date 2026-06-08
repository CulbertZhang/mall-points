<template>
  <div class="address-page">
    <van-nav-bar title="收货地址" left-arrow @click-left="$router.back()">
      <template #right>
        <van-icon name="add-o" size="20" @click="$router.push('/address/edit')" />
      </template>
    </van-nav-bar>
    <div v-if="addresses.length" class="list">
      <van-swipe-cell v-for="a in addresses" :key="a.id">
        <div class="addr-card" @click="onSelect(a)">
          <div class="addr-top">
            <span class="addr-name">{{ a.receiverName }}</span>
            <span class="addr-phone">{{ a.phone }}</span>
            <van-tag v-if="a.isDefault" type="danger" size="mini">默认</van-tag>
            <van-tag v-else size="mini">{{ labelText(a.label) }}</van-tag>
          </div>
          <div class="addr-detail">{{ a.province }}{{ a.city }}{{ a.district }} {{ a.detail }}</div>
          <van-icon name="edit" class="edit-icon" @click.stop="$router.push(`/address/edit/${a.id}`)" />
        </div>
        <template #right>
          <van-button square type="danger" text="删除" class="del-btn" @click="onDelete(a.id)" />
        </template>
      </van-swipe-cell>
    </div>
    <van-empty v-else description="暂无收货地址">
      <van-button type="primary" round @click="$router.push('/address/edit')">添加地址</van-button>
    </van-empty>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast, showConfirmDialog } from 'vant'
import { getAddresses, deleteAddress } from '../api/member'
import type { Address } from '../types'

const route = useRoute()
const router = useRouter()
const addresses = ref<Address[]>([])
const selectMode = route.query.select === '1'

onMounted(async () => {
  const r = await getAddresses()
  addresses.value = r.data || []
})

function labelText(label: string) {
  const m: Record<string, string> = { home: '家', company: '公司', school: '学校' }
  return m[label] || label || '其他'
}

function onSelect(a: Address) {
  if (selectMode) {
    router.back()
    // Use sessionStorage to pass selected address back
    sessionStorage.setItem('selectedAddress', JSON.stringify(a))
  } else {
    router.push(`/address/edit/${a.id}`)
  }
}

async function onDelete(id: number) {
  try {
    await showConfirmDialog({ title: '提示', message: '确定删除该地址吗？' })
    await deleteAddress(id)
    showToast('已删除')
    addresses.value = addresses.value.filter(a => a.id !== id)
  } catch {}
}
</script>

<style scoped>
.address-page { min-height: 100vh; background: #f7f8fa; }
.list { padding: 10px; }
.addr-card { background: #fff; padding: 14px; border-radius: 8px; margin-bottom: 8px; position: relative; }
.addr-top { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.addr-name { font-size: 15px; font-weight: 600; }
.addr-phone { font-size: 13px; color: #666; }
.addr-detail { font-size: 13px; color: #333; padding-right: 30px; }
.edit-icon { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); color: #999; }
.del-btn { height: 100%; }
</style>
