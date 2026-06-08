import request from './request'
import type { ApiResponse, AddressItem } from '@/types'

export function getMemberProfile() {
  return request.get('/member/profile')
}

export function signIn() {
  return request.post('/points/signin')
}

export function getSignInStatus() {
  return request.get('/points/signin/status')
}

export function getAddresses(): Promise<ApiResponse<AddressItem[]>> {
  return request.get('/addresses')
}

export function createAddress(data: any) {
  return request.post('/addresses', data)
}

export function updateAddress(id: number, data: any) {
  return request.put(`/addresses/${id}`, data)
}

export function deleteAddress(id: number) {
  return request.delete(`/addresses/${id}`)
}
