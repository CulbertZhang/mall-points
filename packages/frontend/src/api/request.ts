import axios from 'axios'
import { showToast } from 'vant'
import type { ApiResponse } from '../types'

const http = axios.create({ baseURL: '/api/v1', timeout: 10000 })

http.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

http.interceptors.response.use(
  res => {
    const body = res.data as ApiResponse
    if (body.code !== 0) {
      showToast(body.message || '请求失败')
      return Promise.reject(new Error(body.message))
    }
    return body as any
  },
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
    } else {
      showToast(err.response?.data?.message || err.message || '网络错误')
    }
    return Promise.reject(err)
  },
)

export default http
