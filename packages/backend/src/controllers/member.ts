import { Request, Response, NextFunction } from 'express'
import * as memberService from '../services/member'
import { success } from '../utils/response'

export async function profile(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await memberService.getMemberInfo(req.user!.userId)
    success(res, data)
  } catch (err) { next(err) }
}

export async function signInStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await memberService.getSignInStatus(req.user!.userId)
    success(res, data)
  } catch (err) { next(err) }
}

export async function signIn(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await memberService.signIn(req.user!.userId)
    success(res, data, '签到成功')
  } catch (err) { next(err) }
}

export async function addresses(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await memberService.getAddresses(req.user!.userId)
    success(res, data)
  } catch (err) { next(err) }
}

export async function createAddress(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await memberService.createAddress(req.user!.userId, req.body)
    success(res, data, '添加成功')
  } catch (err) { next(err) }
}

export async function updateAddress(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await memberService.updateAddress(parseInt(req.params.id as string), req.user!.userId, req.body)
    success(res, data, '修改成功')
  } catch (err) { next(err) }
}

export async function deleteAddress(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await memberService.deleteAddress(parseInt(req.params.id as string), req.user!.userId)
    success(res, data, '删除成功')
  } catch (err) { next(err) }
}
