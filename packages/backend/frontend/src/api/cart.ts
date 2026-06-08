import request from './request'
import type { ApiResponse, CartItem } from '@/types'

export function getCart(): Promise<ApiResponse<{
  totalCount: number
  selectedCount: number
  totalPrice: number
  items: CartItem[]
}>> {
  return request.get('/cart')
}

export function addToCart(productId: number, skuId: number, quantity = 1) {
  return request.post('/cart/items', { productId, skuId, quantity })
}

export function updateCartItem(id: number, quantity: number) {
  return request.put(`/cart/items/${id}`, { quantity })
}

export function removeCartItem(id: number) {
  return request.delete(`/cart/items/${id}`)
}
