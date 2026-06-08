<template>
  <div class="categories-page">
    <div class="sidebar">
      <div
        v-for="(c, i) in categories"
        :key="c.id"
        :class="['sidebar-item', { active: activeCat === i }]"
        @click="activeCat = i"
      >{{ c.name }}</div>
    </div>
    <div class="main-content">
      <template v-if="currentCat">
        <div class="sub-cats">
          <van-tag
            v-for="sub in currentCat.children"
            :key="sub.id"
            plain type="primary" size="medium" class="sub-tag"
            @click="selectCategory(sub.id)"
          >{{ sub.name }}</van-tag>
          <van-tag v-if="!currentCat.children.length" plain size="medium" class="sub-tag" type="primary" @click="selectCategory(currentCat.id)">全部</van-tag>
        </div>
        <div class="product-grid">
          <div v-for="p in products" :key="p.id" class="product-card" @click="$router.push(`/product/${p.id}`)">
            <van-image :src="p.coverImage" fit="cover" class="product-img" />
            <div class="product-info">
              <div class="product-name">{{ p.name }}</div>
              <span class="product-price">¥{{ parseFloat(p.price) }}</span>
            </div>
          </div>
        </div>
        <van-empty v-if="!products.length" description="暂无商品" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { getCategories, getProducts } from '../api/product'
import type { Category, Product } from '../types'

const activeCat = ref(0)
const categories = ref<Category[]>([])
const products = ref<Product[]>([])

getCategories().then(r => { categories.value = r.data || []; loadProducts() })

const currentCat = computed(() => categories.value[activeCat.value])

watch(activeCat, () => loadProducts())

function selectCategory(categoryId: number) {
  getProducts({ categoryId, pageSize: 30 }).then(r => products.value = r.data?.list || [])
}

function loadProducts() {
  const cat = currentCat.value
  if (!cat) return
  if (cat.children.length > 0) {
    const ids = [cat.id, ...cat.children.map(c => c.id)]
    Promise.all(ids.map(id => getProducts({ categoryId: id, pageSize: 10 }))).then(results => {
      products.value = results.flatMap(r => r.data?.list || [])
    })
  } else {
    getProducts({ categoryId: cat.id, pageSize: 30 }).then(r => products.value = r.data?.list || [])
  }
}
</script>

<style scoped>
.categories-page { display: flex; height: calc(100vh - 50px); }
.sidebar { width: 90px; background: #f7f8fa; overflow-y: auto; flex-shrink: 0; }
.sidebar-item { padding: 14px 8px; font-size: 13px; text-align: center; color: #666; cursor: pointer; }
.sidebar-item.active { background: #fff; color: #ee0a24; font-weight: 600; }
.main-content { flex: 1; padding: 12px; overflow-y: auto; }
.sub-cats { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
.sub-tag { cursor: pointer; }
.product-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.product-card { background: #fff; border-radius: 8px; overflow: hidden; }
.product-img { width: 100%; height: 140px; }
.product-info { padding: 6px 8px; }
.product-name { font-size: 13px; color: #333; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.product-price { font-size: 15px; font-weight: 700; color: #ee0a24; margin-top: 4px; display: block; }
</style>
