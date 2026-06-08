import { Request, Response, NextFunction } from 'express'
import * as authService from '../services/auth'
import { success } from '../utils/response'

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { phone, password, nickname } = req.body
    const data = await authService.register(phone, password, nickname)
    success(res, data, '注册成功')
  } catch (err) { next(err) }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { account, password } = req.body
    const data = await authService.login(account, password)
    success(res, data, '登录成功')
  } catch (err) { next(err) }
}

export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await authService.getProfile(req.user!.userId)
    success(res, data)
  } catch (err) { next(err) }
}
