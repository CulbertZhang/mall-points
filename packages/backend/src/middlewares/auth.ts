import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken, TokenPayload } from '../utils/jwt'
import { fail } from '../utils/response'

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload
    }
  }
}

export function authRequired(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return fail(res, 401, '请先登录')
  }
  try {
    const token = header.slice(7)
    req.user = verifyAccessToken(token)
    next()
  } catch {
    return fail(res, 401, '登录已过期，请重新登录')
  }
}

export function authOptional(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (header && header.startsWith('Bearer ')) {
    try {
      req.user = verifyAccessToken(header.slice(7))
    } catch {
      // token invalid, continue as guest
    }
  }
  next()
}
