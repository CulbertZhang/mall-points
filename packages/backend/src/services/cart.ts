import { PrismaClient } from '@prisma/client'
import { AppError, ErrorCodes } from '../utils/errors'

const prisma = new PrismaClient()

export async function addToCart(userId: number, productId: number, skuId: number, quantity: number) {
  const sku = await prisma.productSku.findUnique({
    where: { id: BigInt(skuId) },
    include: { product: true },
  })
  if (!sku || sku.product.onsaleStatus !== 1) {
    throw new AppError(ErrorCodes.PRODUCT_NOT_FOUND, '商品不存在或已下架')
  }
  if (sku.stock < quantity) {
    throw new AppError(ErrorCodes.STOCK_INSUFFICIENT, '库存不足')
  }

  const count = await prisma.shoppingCart.count({ where: { userId: BigInt(userId) } })
  if (count >= 100) throw new AppError(ErrorCodes.CART_ITEM_LIMIT, '购物车已满')

  const existing = await prisma.shoppingCart.findUnique({
    where: { userId_skuId: { userId: BigInt(userId), skuId: BigInt(skuId) } },
  })

  if (existing) {
    const cartItem = await prisma.shoppingCart.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity, addedPrice: sku.price },
    })
    return { cartItemId: Number(cartItem.id), quantity: cartItem.quantity }
  }

  const cartItem = await prisma.shoppingCart.create({
    data: {
      userId: BigInt(userId),
      productId: BigInt(productId),
      skuId: BigInt(skuId),
      quantity,
      addedPrice: sku.price,
    },
  })

  const totalCount = await prisma.shoppingCart.count({ where: { userId: BigInt(userId) } })
  return {
    cartItemId: Number(cartItem.id),
    productId,
    skuId,
    productName: sku.product.name,
    skuDesc: sku.skuName,
    coverImage: sku.product.mainImageUrl,
    price: sku.price,
    quantity,
    selected: true,
    stock: sku.stock,
    cartTotalCount: totalCount,
  }
}

export async function getCart(userId: number) {
  const items = await prisma.shoppingCart.findMany({
    where: { userId: BigInt(userId) },
    include: { product: true, sku: true },
    orderBy: { createdAt: 'desc' },
  })

  const list = items.map(item => {
    const isValid = item.sku.stock > 0 && item.product.onsaleStatus === 1
    return {
      cartItemId: Number(item.id),
      productId: Number(item.productId),
      productName: item.product.name,
      skuId: Number(item.skuId),
      skuDesc: item.sku.skuName,
      coverImage: item.product.mainImageUrl,
      price: item.sku.price,
      originalPrice: item.sku.originalPrice,
      quantity: item.quantity,
      selected: item.isSelected,
      stock: item.sku.stock,
      isValid,
      invalidReason: isValid ? null : '商品已失效',
    }
  })

  const selectedItems = list.filter(i => i.selected && i.isValid)
  const totalQuantity = list.reduce((s, i) => s + i.quantity, 0)
  return {
    totalCount: totalQuantity,
    selectedCount: selectedItems.length,
    totalPrice: selectedItems.reduce((s, i) => s + Number(i.price) * i.quantity, 0),
    selectedPrice: selectedItems.reduce((s, i) => s + Number(i.price) * i.quantity, 0),
    items: list,
  }
}

export async function updateCartItem(cartItemId: number, userId: number, quantity: number) {
  const item = await prisma.shoppingCart.findFirst({
    where: { id: BigInt(cartItemId), userId: BigInt(userId) },
  })
  if (!item) throw new AppError(ErrorCodes.CART_ITEM_NOT_FOUND, '购物车记录不存在')

  await prisma.shoppingCart.update({
    where: { id: BigInt(cartItemId) },
    data: { quantity },
  })
  return { cartItemId, quantity }
}

export async function removeCartItem(cartItemId: number, userId: number) {
  const item = await prisma.shoppingCart.findFirst({
    where: { id: BigInt(cartItemId), userId: BigInt(userId) },
  })
  if (!item) return { deleted: false }

  await prisma.shoppingCart.delete({ where: { id: BigInt(cartItemId) } })
  const totalCount = await prisma.shoppingCart.count({ where: { userId: BigInt(userId) } })
  return { deleted: true, cartTotalCount: totalCount }
}
