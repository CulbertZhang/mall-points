import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CartItem } from '@/types'
import { getCart, addToCart, updateCartItem, removeCartItem } from '@/api/cart'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const loading = ref(false)

  const totalCount = computed(() => items.value.length)
  const selectedCount = computed(() => items.value.filter(i => i.selected && i.isValid).length)
  const totalPrice = computed(() => items.value
    .filter(i => i.selected && i.isValid)
    .reduce((s, i) => s + Number(i.price) * i.quantity, 0))

  async function fetchCart() {
    loading.value = true
    try {
      const res = await getCart()
      items.value = res.data.items
    } finally {
      loading.value = false
    }
  }

  async function add(productId: number, skuId: number, quantity = 1) {
    await addToCart(productId, skuId, quantity)
    await fetchCart()
  }

  async function update(id: number, quantity: number) {
    await updateCartItem(id, quantity)
    await fetchCart()
  }

  async function remove(id: number) {
    await removeCartItem(id)
    await fetchCart()
  }

  return { items, loading, totalCount, selectedCount, totalPrice, fetchCart, add, update, remove }
})
