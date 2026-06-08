<script setup lang="ts">
defineProps<{ message?: string; actionText?: string }>()
const emit = defineEmits(['action'])
</script>

<template>
  <div style="text-align:center; padding: 60px 20px; color: #999">
    <van-icon name="notes-o" size="48" color="#ddd" />
    <p style="margin: 12px 0">{{ message || '暂无数据' }}</p>
    <van-button v-if="actionText" size="small" @click="emit('action')">{{ actionText }}</van-button>
  </div>
</template>
