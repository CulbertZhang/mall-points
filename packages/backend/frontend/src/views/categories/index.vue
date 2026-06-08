<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCategories, getProducts } from '@/api/product'
import type { CategoryItem, ProductItem } from '@/types'
import PageLoading from '@/components/PageLoading.vue'
import GoodsCard from '@/components/GoodsCard.vue'

const router = useRouter()
const categories = ref<CategoryItem[]>([])
const products = ref<ProductItem[]>([])
const activeCategory = ref(0)
const loading = ref(true)

async function fetchCategories() {
  const res = await getCategories()
  categories.value = res.data
  if (categories.value.length > 0) {
    activeCategory.value = categories.value[0].id
    await fetchProducts(categories.value[0].id)
  }
  loading.value = false
}

async function fetchProducts(catId: number) {
  const res = await getProducts({ categoryId: catId, pageSize: 20 })
  products.value = res.data.list
}

function onCategoryClick(cat: CategoryItem) {
  activeCategory.value = cat.id
  fetchProducts(cat.id)
}

function goProduct(id: number) { router.push(`/product/${id}`) }
function goSearch() { router.push('/search') }

onMounted(fetchCategories)
</script>

<template>
  <div class="page-container" style="display:flex; flex-direction:column; height:100vh">
    <van-nav-bar title="商品分类" fixed>
      <template #right><van-icon name="search" @click="goSearch" /></template>
    </van-nav-bar>

    <div style="display:flex; flex:1; margin-top:46px; overflow:hidden">
      <!-- Left sidebar -->
      <div style="width:90px; background:#fff; overflow-y:auto">
        <div v-for="cat in categories" :key="cat.id"
          :class="['cat-item', { active: activeCategory === cat.id }]"
          @click="onCategoryClick(cat)">
          {{ cat.name }}
        </div>
      </div>

      <!-- Right content -->
      <div style="flex:1; overflow-y:auto; padding:8px">
        <PageLoading v-if="loading" />
        <div v-else style="display:grid; grid-template-columns:1fr 1fr; gap:8px">
          <GoodsCard v-for="item in products" :key="item.id" :item="item" />
        </div>
        <van-empty v-if="!loading && products.length === 0" description="暂无商品" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.cat-item { padding: 14px 8px; font-size: 13px; text-align: center; color: #666; position: relative; }
.cat-item.active { color: var(--color-primary); background: var(--color-bg); font-weight: 600; }
.cat-item.active::before { content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 3px; height: 16px; background: var(--color-primary); border-radius: 0 2px 2px 0; }
</style>
