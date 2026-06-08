import axios from 'axios'
import { showToast } from 'vant'

const request = axios.create({
  baseURL: '/api/v1',
  timeout: 15000,
})

request.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

request.interceptors.response.use(
  (res) => {
    const body = res.data
    if (body.code !== 0) {
      showToast(body.message || '请求失败')
      return Promise.reject(body)
    }
    return body
  },
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('accessToken')
      showToast('登录已过期，请重新登录')
      setTimeout(() => { window.location.href = '#/login' }, 1000)
    } else {
      showToast('网络异常，请稍后重试')
    }
    return Promise.reject(err)
  }
)

export default request
