import http from './request'
import type { ApiResponse, Product, ProductDetail, Category, PaginatedList } from '../types'

export function getProducts(params?: {
  page?: number; pageSize?: number; categoryId?: number; keyword?: string; sortBy?: string
}) {
  return http.get<unknown, ApiResponse<PaginatedList<Product>>>('/products', { params })
}

export function getProductDetail(id: number) {
  return http.get<unknown, ApiResponse<ProductDetail>>(`/products/${id}`)
}

export function getCategories() {
  return http.get<unknown, ApiResponse<Category[]>>('/categories')
}
