import { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError } from 'zod'
import { fail } from '../utils/response'

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body)
      next()
    } catch (err) {
      if (err instanceof ZodError) {
        const msg = err.errors.map(e => e.message).join('; ')
        return fail(res, 400, `参数校验失败: ${msg}`)
      }
      next(err)
    }
  }
}
