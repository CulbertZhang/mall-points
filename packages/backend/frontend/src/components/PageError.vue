<script setup lang="ts">
defineProps<{ message?: string }>()
const emit = defineEmits(['retry'])
</script>

<template>
  <div style="text-align:center; padding: 60px 20px; color: #999">
    <van-icon name="warn-o" size="48" color="#ccc" />
    <p style="margin: 12px 0">{{ message || '加载失败' }}</p>
    <van-button size="small" @click="emit('retry')">重试</van-button>
  </div>
</template>
