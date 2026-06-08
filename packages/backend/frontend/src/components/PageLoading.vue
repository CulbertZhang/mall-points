<script setup lang="ts">
defineProps<{ rows?: number }>()
</script>

<template>
  <div class="page-loading" style="padding: 16px">
    <div class="skeleton" v-for="i in (rows || 3)" :key="i"
      :style="{ height: i === 1 ? '180px' : '60px', marginBottom: '12px' }" />
  </div>
</template>
