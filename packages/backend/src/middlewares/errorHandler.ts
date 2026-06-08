import { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/errors'
import { fail } from '../utils/response'

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error('[Error]', err)

  if (err instanceof AppError) {
    return fail(res, err.code, err.message)
  }

  return fail(res, 500, '服务器内部错误')
}
