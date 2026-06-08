<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createAddress, updateAddress, getAddresses } from '@/api/member'
import { showToast } from 'vant'

const route = useRoute()
const router = useRouter()
const editId = ref<number | null>(null)
const saving = ref(false)

const form = ref({
  receiverName: '',
  phone: '',
  province: '广东省',
  city: '深圳市',
  district: '南山区',
  detail: '',
  isDefault: false,
  label: 'home',
})

onMounted(async () => {
  const id = route.query.id
  if (id) {
    editId.value = Number(id)
    try {
      const res = await getAddresses()
      const addr = res.data.find(a => a.id === editId.value)
      if (addr) {
        form.value = {
          receiverName: addr.receiverName,
          phone: addr.phone,
          province: addr.province,
          city: addr.city,
          district: addr.district,
          detail: addr.detail,
          isDefault: addr.isDefault,
          label: addr.label,
        }
      }
    } catch { /* ignore */ }
  }
})

async function save() {
  if (!form.value.receiverName || !form.value.phone || !form.value.detail) {
    showToast('请填写完整信息')
    return
  }
  saving.value = true
  try {
    if (editId.value) {
      await updateAddress(editId.value, form.value)
    } else {
      await createAddress(form.value)
    }
    showToast('保存成功')
    router.back()
  } catch { /* handled */ }
  finally { saving.value = false }
}
</script>

<template>
  <div style="min-height:100vh; background:#f5f5f5">
    <van-nav-bar :title="editId ? '编辑地址' : '新增地址'" left-arrow @click-left="router.back()" />

    <van-cell-group style="margin-top:8px">
      <van-field v-model="form.receiverName" label="收货人" placeholder="请输入收货人姓名" />
      <van-field v-model="form.phone" label="手机号" placeholder="请输入手机号" type="tel" maxlength="11" />
      <van-field :model-value="form.province + ' ' + form.city + ' ' + form.district"
        label="所在地区" readonly placeholder="请选择省市区" is-link />
      <van-field v-model="form.detail" label="详细地址" placeholder="请输入街道门牌号" type="textarea" rows="2" />
    </van-cell-group>

    <van-cell-group style="margin-top:8px">
      <van-cell title="设为默认地址">
        <template #right-icon><van-switch v-model="form.isDefault" size="20" /></template>
      </van-cell>
    </van-cell-group>

    <div style="padding: 24px 16px">
      <van-button block type="primary" :loading="saving" @click="save">保存</van-button>
    </div>
  </div>
</template>
