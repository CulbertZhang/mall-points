import request from './request'
import type { ApiResponse, UserInfo } from '@/types'

export function login(account: string, password: string): Promise<ApiResponse<{
  accessToken: string
  refreshToken: string
  expiresIn: number
  userInfo: UserInfo
}>> {
  return request.post('/auth/login', { account, password })
}

export function register(phone: string, password: string, nickname?: string) {
  return request.post('/auth/register', { phone, password, nickname })
}

export function getProfile(): Promise<ApiResponse<UserInfo>> {
  return request.get('/user/profile')
}
