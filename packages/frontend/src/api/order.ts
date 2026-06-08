import http from './request'
import type { ApiResponse, OrderListItem, OrderDetail, CreateOrderResult, PaginatedList } from '../types'

export function createOrder(data: {
  source: string
  addressId: number
  items?: Array<{ productId: number; skuId: number; quantity: number }>
  pointsDeduction?: number
  remark?: string
  payType: string
}) {
  return http.post<unknown, ApiResponse<CreateOrderResult>>('/orders', data)
}

export function getOrders(params?: { page?: number; pageSize?: number; status?: string }) {
  return http.get<unknown, ApiResponse<PaginatedList<OrderListItem>>>('/orders', { params })
}

export function getOrderDetail(id: number) {
  return http.get<unknown, ApiResponse<OrderDetail>>(`/orders/${id}`)
}

export function cancelOrder(id: number) {
  return http.put<unknown, ApiResponse<any>>(`/orders/${id}/cancel`)
}
