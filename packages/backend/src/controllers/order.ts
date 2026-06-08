import { Request, Response, NextFunction } from 'express'
import * as orderService from '../services/order'
import { success } from '../utils/response'

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await orderService.createOrder(req.user!.userId, req.body)
    success(res, data, '订单创建成功')
  } catch (err) { next(err) }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const { page = '1', pageSize = '20', status } = req.query
    const data = await orderService.getOrderList(
      req.user!.userId,
      status as string,
      parseInt(page as string),
      parseInt(pageSize as string)
    )
    success(res, data)
  } catch (err) { next(err) }
}

export async function detail(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await orderService.getOrderDetail(parseInt(req.params.id as string), req.user!.userId)
    success(res, data)
  } catch (err) { next(err) }
}

export async function cancel(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await orderService.cancelOrder(parseInt(req.params.id as string), req.user!.userId)
    success(res, data, '订单已取消')
  } catch (err) { next(err) }
}
