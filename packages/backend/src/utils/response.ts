import { Response } from 'express'

export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T | null
  timestamp: number
}

export function success<T>(res: Response, data: T, message = 'success') {
  const body: ApiResponse<T> = { code: 0, message, data, timestamp: Date.now() }
  return res.json(body)
}

export function fail(res: Response, code: number, message: string) {
  const body: ApiResponse = { code, message, data: null, timestamp: Date.now() }
  return res.status(code >= 10000 ? 400 : 500).json(body)
}
