import { Request, Response, NextFunction } from 'express'
import * as productService from '../services/product'
import { success } from '../utils/response'

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const { page = '1', pageSize = '20', categoryId, keyword, sortBy } = req.query
    const data = await productService.getProductList({
      page: parseInt(page as string),
      pageSize: parseInt(pageSize as string),
      categoryId: categoryId ? parseInt(categoryId as string) : undefined,
      keyword: keyword as string,
      sortBy: sortBy as string,
    })
    success(res, data)
  } catch (err) { next(err) }
}

export async function detail(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await productService.getProductDetail(parseInt(req.params.id as string))
    success(res, data)
  } catch (err) { next(err) }
}

export async function categories(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await productService.getCategories()
    success(res, data)
  } catch (err) { next(err) }
}
