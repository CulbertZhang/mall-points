import http from './request'
import type { ApiResponse, Banner, NavItem } from '../types'

export function getBanners() {
  return http.get<unknown, ApiResponse<Banner[]>>('/marketing/banners')
}

export function getNavigations(position: string = 'home') {
  return http.get<unknown, ApiResponse<NavItem[]>>('/config/nav', { params: { position } })
}
