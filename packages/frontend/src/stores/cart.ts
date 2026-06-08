import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getCart, addToCart, updateCartItem, removeCartItem } from '../api/cart'
import type { CartItem } from '../types'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const totalCount = ref(0)

  const selectedItems = computed(() => items.value.filter(i => i.selected && i.isValid))
  const totalPrice = computed(() =>
    selectedItems.value.reduce((s, i) => s + Number(i.price) * i.quantity, 0),
  )

  async function fetchCart() {
    try {
      const res = await getCart()
      if (res.data) {
        items.value = res.data.items || []
        totalCount.value = res.data.totalCount || 0
      }
    } catch { /* ignore */ }
  }

  async function add(productId: number, skuId: number, quantity: number = 1) {
    await addToCart(productId, skuId, quantity)
    await fetchCart()
  }

  async function update(id: number, quantity: number) {
    await updateCartItem(id, quantity)
    await fetchCart()
  }

  async function remove(id: number) {
    await removeCartItem(id)
    items.value = items.value.filter(i => i.cartItemId !== id)
    totalCount.value = items.value.reduce((s, i) => s + i.quantity, 0)
  }

  function toggleSelect(cartItemId: number) {
    const item = items.value.find(i => i.cartItemId === cartItemId)
    if (item) item.selected = !item.selected
  }

  function toggleSelectAll() {
    const allSelected = items.value.every(i => i.selected)
    for (const item of items.value) item.selected = !allSelected
  }

  return { items, totalCount, selectedItems, totalPrice, fetchCart, add, update, remove, toggleSelect, toggleSelectAll }
})
