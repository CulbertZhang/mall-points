import request from './request'
import type { ApiResponse, OrderItem, PaginatedData } from '@/types'

export function createOrder(data: {
  source: string
  addressId: number
  pointsDeduction?: number
  remark?: string
  payType: string
}): Promise<ApiResponse<{ orderId: number; orderNo: string; payAmount: number }>> {
  return request.post('/orders', data)
}

export function getOrders(params: {
  page?: number
  pageSize?: number
  status?: string
}): Promise<ApiResponse<PaginatedData<OrderItem>>> {
  return request.get('/orders', { params })
}

export function getOrderDetail(id: number) {
  return request.get(`/orders/${id}`)
}

export function cancelOrder(id: number) {
  return request.put(`/orders/${id}/cancel`)
}
