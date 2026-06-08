import { Request, Response, NextFunction } from 'express'
import * as cartService from '../services/cart'
import { success } from '../utils/response'

export async function add(req: Request, res: Response, next: NextFunction) {
  try {
    const { productId, skuId, quantity } = req.body
    const data = await cartService.addToCart(req.user!.userId, productId, skuId, quantity)
    success(res, data, '已添加到购物车')
  } catch (err) { next(err) }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await cartService.getCart(req.user!.userId)
    success(res, data)
  } catch (err) { next(err) }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const { quantity } = req.body
    const data = await cartService.updateCartItem(parseInt(req.params.id as string), req.user!.userId, quantity)
    success(res, data, '修改成功')
  } catch (err) { next(err) }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await cartService.removeCartItem(parseInt(req.params.id as string), req.user!.userId)
    success(res, data, '已删除')
  } catch (err) { next(err) }
}
