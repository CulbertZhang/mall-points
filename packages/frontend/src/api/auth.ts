import http from './request'
import type { ApiResponse, AuthData, UserInfo } from '../types'

export function login(account: string, password: string) {
  return http.post<unknown, ApiResponse<AuthData>>('/auth/login', { account, password })
}

export function register(phone: string, password: string, nickname?: string) {
  return http.post<unknown, ApiResponse<AuthData>>('/auth/register', { phone, password, nickname })
}

export function getProfile() {
  return http.get<unknown, ApiResponse<UserInfo>>('/user/profile')
}
