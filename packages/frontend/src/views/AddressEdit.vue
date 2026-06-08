<template>
  <div class="address-edit-page">
    <van-nav-bar :title="isEdit ? '编辑地址' : '新增地址'" left-arrow @click-left="$router.back()" />
    <van-form @submit="onSubmit">
      <van-field v-model="form.receiverName" label="收货人" placeholder="请输入收货人姓名" :rules="[{required: true, message: '请填写收货人'}]" />
      <van-field v-model="form.phone" label="手机号" placeholder="请输入手机号" :rules="[{required: true, message: '请填写手机号'}]" />
      <van-field v-model="form.province" label="省份" placeholder="请输入省份" :rules="[{required: true, message: '请填写省份'}]" />
      <van-field v-model="form.city" label="城市" placeholder="请输入城市" :rules="[{required: true, message: '请填写城市'}]" />
      <van-field v-model="form.district" label="区/县" placeholder="请输入区/县" :rules="[{required: true, message: '请填写区县'}]" />
      <van-field v-model="form.detail" label="详细地址" placeholder="请输入详细地址" :rules="[{required: true, message: '请填写详细地址'}]" />
      <van-field name="label" label="地址标签">
        <template #input>
          <van-radio-group v-model="form.label" direction="horizontal">
            <van-radio name="home">家</van-radio>
            <van-radio name="company">公司</van-radio>
            <van-radio name="school">学校</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-cell center title="设为默认地址">
        <template #right-icon>
          <van-switch v-model="form.isDefault" />
        </template>
      </van-cell>
      <div style="margin: 16px">
        <van-button block type="primary" native-type="submit" :loading="loading">保存</van-button>
        <van-button v-if="isEdit" block type="default" style="margin-top: 12px" @click="onDelete">删除地址</van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast, showConfirmDialog } from 'vant'
import { createAddress, updateAddress, deleteAddress, getAddresses } from '../api/member'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const isEdit = computed(() => !!route.params.id)

const form = ref({
  receiverName: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  isDefault: false,
  label: 'home',
})

onMounted(async () => {
  if (route.params.id) {
    const r = await getAddresses()
    const addr = (r.data || []).find(a => a.id === Number(route.params.id))
    if (addr) {
      form.value = {
        receiverName: addr.receiverName,
        phone: addr.phone,
        province: addr.province,
        city: addr.city,
        district: addr.district,
        detail: addr.detail,
        isDefault: addr.isDefault,
        label: addr.label || 'home',
      }
    }
  }
})

async function onSubmit() {
  loading.value = true
  try {
    if (isEdit.value) {
      await updateAddress(Number(route.params.id), form.value)
    } else {
      await createAddress(form.value)
    }
    showToast('保存成功')
    router.back()
  } catch {}
  finally { loading.value = false }
}

async function onDelete() {
  try {
    await showConfirmDialog({ title: '提示', message: '确定删除该地址吗？' })
    await deleteAddress(Number(route.params.id))
    showToast('已删除')
    router.back()
  } catch {}
}
</script>

<style scoped>
.address-edit-page { min-height: 100vh; background: #f7f8fa; }
</style>
