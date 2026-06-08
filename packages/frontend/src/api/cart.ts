import http from './request'
import type { ApiResponse, CartData } from '../types'

export function getCart() {
  return http.get<unknown, ApiResponse<CartData>>('/cart')
}

export function addToCart(productId: number, skuId: number, quantity: number) {
  return http.post<unknown, ApiResponse<null>>('/cart/items', { productId, skuId, quantity })
}

export function updateCartItem(id: number, quantity: number) {
  return http.put<unknown, ApiResponse<null>>(`/cart/items/${id}`, { quantity })
}

export function removeCartItem(id: number) {
  return http.delete<unknown, ApiResponse<null>>(`/cart/items/${id}`)
}
