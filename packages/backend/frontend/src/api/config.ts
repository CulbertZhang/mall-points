import request from './request'
import type { ApiResponse, BannerItem, NavItem } from '@/types'

export function getBanners(): Promise<ApiResponse<BannerItem[]>> {
  return request.get('/marketing/banners')
}

export function getNavigations(position = 'home'): Promise<ApiResponse<NavItem[]>> {
  return request.get('/config/nav', { params: { position } })
}
