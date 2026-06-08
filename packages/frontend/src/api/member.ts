import http from './request'
import type { ApiResponse, MemberProfile, SignInStatus, SignInResult, Address } from '../types'

export function getMemberProfile() {
  return http.get<unknown, ApiResponse<MemberProfile>>('/member/profile')
}

export function getSignInStatus() {
  return http.get<unknown, ApiResponse<SignInStatus>>('/points/signin/status')
}

export function signIn() {
  return http.post<unknown, ApiResponse<SignInResult>>('/points/signin')
}

export function getAddresses() {
  return http.get<unknown, ApiResponse<Address[]>>('/addresses')
}

export function createAddress(data: {
  receiverName: string; phone: string; province: string; city: string
  district: string; detail: string; isDefault?: boolean; label?: string
}) {
  return http.post<unknown, ApiResponse<Address>>('/addresses', data)
}

export function updateAddress(id: number, data: Partial<Address>) {
  return http.put<unknown, ApiResponse<any>>(`/addresses/${id}`, data)
}

export function deleteAddress(id: number) {
  return http.delete<unknown, ApiResponse<any>>(`/addresses/${id}`)
}
