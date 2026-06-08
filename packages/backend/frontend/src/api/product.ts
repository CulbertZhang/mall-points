import request from './request'
import type { ApiResponse, ProductItem, ProductDetail, CategoryItem, PaginatedData } from '@/types'

export function getProducts(params: {
  page?: number
  pageSize?: number
  categoryId?: number
  keyword?: string
  sortBy?: string
}): Promise<ApiResponse<PaginatedData<ProductItem>>> {
  return request.get('/products', { params })
}

export function getProductDetail(id: number): Promise<ApiResponse<ProductDetail>> {
  return request.get(`/products/${id}`)
}

export function getCategories(): Promise<ApiResponse<CategoryItem[]>> {
  return request.get('/categories')
}

export function searchProducts(keyword: string, page = 1): Promise<ApiResponse<PaginatedData<ProductItem>>> {
  return request.get('/products/search', { params: { keyword, page } })
}
