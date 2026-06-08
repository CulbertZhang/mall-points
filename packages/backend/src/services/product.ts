import { PrismaClient } from '@prisma/client'
import { AppError, ErrorCodes } from '../utils/errors'

const prisma = new PrismaClient()

export async function getProductList(params: {
  page: number
  pageSize: number
  categoryId?: number
  keyword?: string
  sortBy?: string
}) {
  const { page, pageSize, categoryId, keyword, sortBy } = params
  const where: Record<string, unknown> = { onsaleStatus: 1, deletedAt: null }

  if (categoryId) where.categoryId = categoryId
  if (keyword) where.name = { contains: keyword }

  let orderBy: Record<string, string> = { sortOrder: 'asc' }
  if (sortBy === 'sale') orderBy = { salesCount: 'desc' }
  if (sortBy === 'price_asc') orderBy = { minPrice: 'asc' }
  if (sortBy === 'price_desc') orderBy = { minPrice: 'desc' }
  if (sortBy === 'newest') orderBy = { createdAt: 'desc' }

  const [list, total] = await Promise.all([
    prisma.product.findMany({
      where: where as any,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        name: true,
        subtitle: true,
        mainImageUrl: true,
        minPrice: true,
        maxPrice: true,
        salesCount: true,
        totalStock: true,
        tags: true,
      },
    }),
    prisma.product.count({ where: where as any }),
  ])

  return {
    list: list.map(p => ({
      id: Number(p.id),
      name: p.name,
      subtitle: p.subtitle,
      coverImage: p.mainImageUrl,
      price: p.minPrice,
      salesCount: p.salesCount,
      stock: p.totalStock,
      tags: p.tags,
    })),
    pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
  }
}

export async function getProductDetail(productId: number) {
  const product = await prisma.product.findFirst({
    where: { id: BigInt(productId), onsaleStatus: 1, deletedAt: null },
    include: { skus: true, images: { orderBy: { sortOrder: 'asc' } }, category: true },
  })
  if (!product) throw new AppError(ErrorCodes.PRODUCT_NOT_FOUND, '商品不存在或已下架')

  return {
    id: Number(product.id),
    name: product.name,
    subtitle: product.subtitle,
    categoryPath: product.category.name,
    coverImage: product.mainImageUrl,
    imageList: product.images.map(i => i.imageUrl),
    price: product.minPrice,
    originalPrice: product.maxPrice,
    salesCount: product.salesCount,
    stock: product.totalStock,
    tags: product.tags,
    description: product.detailHtml,
    skus: product.skus.map(s => ({
      skuId: Number(s.id),
      skuName: s.skuName,
      specInfo: s.specInfo,
      price: s.price,
      stock: s.stock,
      skuImage: s.imageUrl,
    })),
  }
}

export async function getCategories() {
  const categories = await prisma.category.findMany({
    where: { status: 1 },
    orderBy: { sortOrder: 'asc' },
  })
  return buildTree(categories.map(c => ({ ...c, id: Number(c.id), parentId: Number(c.parentId) })))
}

function buildTree(list: Array<{ id: number; parentId: number; [k: string]: unknown }>) {
  const map = new Map<number, any>()
  const roots: any[] = []
  for (const item of list) {
    map.set(item.id, { ...item, children: [] })
  }
  for (const item of list) {
    const node = map.get(item.id)
    if (item.parentId === 0 || !map.has(item.parentId)) {
      roots.push(node)
    } else {
      map.get(item.parentId).children.push(node)
    }
  }
  return roots
}
