<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAddresses, deleteAddress } from '@/api/member'
import PageLoading from '@/components/PageLoading.vue'
import PageEmpty from '@/components/PageEmpty.vue'
import { showDialog, showToast } from 'vant'
import type { AddressItem } from '@/types'

const router = useRouter()
const addresses = ref<AddressItem[]>([])
const loading = ref(true)

onMounted(async () => {
  try { addresses.value = (await getAddresses()).data } finally { loading.value = false }
})

async function handleDelete(id: number) {
  try {
    await showDialog({ title: '提示', message: '确定删除此地址？' })
    await deleteAddress(id)
    addresses.value = addresses.value.filter(a => a.id !== id)
    showToast('已删除')
  } catch { /* cancel */ }
}
</script>

<template>
  <div style="min-height:100vh; background:#f5f5f5; padding-bottom:60px">
    <van-nav-bar title="收货地址" left-arrow @click-left="router.back()" />

    <PageLoading v-if="loading" />
    <PageEmpty v-else-if="addresses.length === 0" message="还没有收货地址" actionText="新增地址"
      @action="router.push('/address/edit')" />

    <div v-else>
      <div v-for="addr in addresses" :key="addr.id" class="addr-item">
        <div @click="router.push(`/address/edit?id=${addr.id}`)">
          <div style="display:flex; justify-content:space-between">
            <span style="font-weight:600">{{ addr.receiverName }} {{ addr.phone }}</span>
            <van-tag v-if="addr.isDefault" type="danger">默认</van-tag>
          </div>
          <p style="font-size:12px; color:#666; margin-top:4px">
            {{ addr.province }}{{ addr.city }}{{ addr.district }} {{ addr.detail }}
          </p>
        </div>
        <div style="display:flex; gap:12px; margin-top:8px; justify-content:flex-end">
          <van-icon name="delete-o" @click="handleDelete(addr.id)" />
        </div>
      </div>
    </div>

    <div style="position:fixed; bottom:0; left:0; right:0; padding:12px; background:#fff">
      <van-button block type="primary" @click="router.push('/address/edit')">+ 新增收货地址</van-button>
    </div>
  </div>
</template>

<style scoped>
.addr-item { background: #fff; padding: 16px; margin-bottom: 1px; }
</style>
