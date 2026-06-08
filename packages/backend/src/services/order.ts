import { PrismaClient } from '@prisma/client'
import { AppError, ErrorCodes } from '../utils/errors'

const prisma = new PrismaClient()

function genOrderNo() {
  const now = new Date()
  const ts = now.toISOString().replace(/[-:T.]/g, '').slice(0, 14)
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `ORD${ts}${rand}`
}

export async function createOrder(
  userId: number,
  params: {
    source: string
    items?: Array<{ productId: number; skuId: number; quantity: number }>
    addressId: number
    pointsDeduction?: number
    remark?: string
    payType: string
  }
) {
  const address = await prisma.userAddress.findFirst({
    where: { id: BigInt(params.addressId), userId: BigInt(userId) },
  })
  if (!address) throw new AppError(ErrorCodes.ADDRESS_NOT_FOUND, '收货地址不存在')

  let orderItems: Array<{ productId: number; skuId: number; quantity: number }> = []

  if (params.source === 'cart') {
    const cartItems = await prisma.shoppingCart.findMany({
      where: { userId: BigInt(userId), isSelected: true },
      include: { sku: true },
    })
    if (cartItems.length === 0) throw new AppError(10401, '请选择要结算的商品')
    orderItems = cartItems.map(c => ({
      productId: Number(c.productId),
      skuId: Number(c.skuId),
      quantity: c.quantity,
    }))
  } else if (params.items) {
    orderItems = params.items
  }

  let totalProductAmount = 0
  const items = []

  for (const oi of orderItems) {
    const sku = await prisma.productSku.findUnique({
      where: { id: BigInt(oi.skuId) },
      include: { product: true },
    })
    if (!sku || sku.product.onsaleStatus !== 1) {
      throw new AppError(ErrorCodes.PRODUCT_OFFLINE, `${oi.skuId} 商品已下架`)
    }
    if (sku.stock < oi.quantity) {
      throw new AppError(ErrorCodes.STOCK_INSUFFICIENT, `${sku.skuName} 库存不足`)
    }
    const price = Number(sku.price)
    totalProductAmount += price * oi.quantity
    items.push({ sku, quantity: oi.quantity, price })
  }

  const pointsDeduction = params.pointsDeduction || 0
  const freightAmount = 0
  const payAmount = totalProductAmount - pointsDeduction + freightAmount
  const orderNo = genOrderNo()

  const order = await prisma.order.create({
    data: {
      orderNo,
      userId: BigInt(userId),
      orderType: 1,
      status: 'pending_pay',
      totalProductAmount,
      payAmount: Math.max(payAmount, 0),
      freightAmount,
      pointsUsed: pointsDeduction,
      pointsEarned: Math.floor(totalProductAmount / 100), // 1 yuan = 1 point
      growthValueEarned: Math.floor(totalProductAmount / 100),
      shippingReceiverName: address.receiverName,
      shippingReceiverPhone: address.receiverPhone,
      shippingProvince: address.province,
      shippingCity: address.city,
      shippingDistrict: address.district,
      shippingDetail: address.detailAddress,
      buyerRemark: params.remark,
      items: {
        create: items.map(i => ({
          orderNo,
          productId: i.sku.productId,
          skuId: i.sku.id,
          productName: i.sku.product.name,
          productImageUrl: i.sku.product.mainImageUrl,
          price: i.price,
          quantity: i.quantity,
          totalAmount: i.price * i.quantity,
        })),
      },
      statusLogs: {
        create: { orderNo, toStatus: 'pending_pay', operatorType: 'user', operatorId: BigInt(userId) },
      },
    },
  })

  // Clear cart items if from cart
  if (params.source === 'cart') {
    await prisma.shoppingCart.deleteMany({ where: { userId: BigInt(userId), isSelected: true } })
  }

  return {
    orderId: Number(order.id),
    orderNo: order.orderNo,
    totalAmount: totalProductAmount,
    pointsDeductionAmount: pointsDeduction,
    freight: freightAmount,
    payAmount: Math.max(payAmount, 0),
  }
}

export async function getOrderList(userId: number, status?: string, page = 1, pageSize = 20) {
  const where: Record<string, unknown> = { userId: BigInt(userId) }
  if (status && status !== 'all') where.status = status

  const [list, total] = await Promise.all([
    prisma.order.findMany({
      where: where as any,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { items: true },
    }),
    prisma.order.count({ where: where as any }),
  ])

  const statusNames: Record<string, string> = {
    pending_pay: '待付款',
    pending_ship: '待发货',
    pending_receipt: '待收货',
    completed: '已完成',
    cancelled: '已关闭',
  }

  return {
    list: list.map(o => ({
      orderId: Number(o.id),
      orderNo: o.orderNo,
      status: o.status,
      statusName: statusNames[o.status] || o.status,
      totalAmount: o.totalProductAmount,
      payAmount: o.payAmount,
      items: o.items.map(i => ({
        productId: Number(i.productId),
        productName: i.productName,
        coverImage: i.productImageUrl,
        price: i.price,
        quantity: i.quantity,
      })),
      itemCount: o.items.length,
      freight: o.freightAmount,
      createdAt: o.createdAt,
    })),
    pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
  }
}

export async function getOrderDetail(orderId: number, userId: number) {
  const order = await prisma.order.findFirst({
    where: { id: BigInt(orderId), userId: BigInt(userId) },
    include: { items: true, statusLogs: { orderBy: { createdAt: 'desc' } } },
  })
  if (!order) throw new AppError(ErrorCodes.ORDER_NOT_FOUND, '订单不存在')

  return {
    orderId: Number(order.id),
    orderNo: order.orderNo,
    status: order.status,
    totalAmount: order.totalProductAmount,
    payAmount: order.payAmount,
    freight: order.freightAmount,
    pointsUsed: order.pointsUsed,
    items: order.items.map(i => ({
      productId: Number(i.productId),
      productName: i.productName,
      coverImage: i.productImageUrl,
      price: i.price,
      quantity: i.quantity,
      totalPrice: i.totalAmount,
    })),
    address: {
      receiverName: order.shippingReceiverName,
      phone: order.shippingReceiverPhone,
      province: order.shippingProvince,
      city: order.shippingCity,
      district: order.shippingDistrict,
      detail: order.shippingDetail,
    },
    timeline: order.statusLogs.map(l => ({
      time: l.createdAt,
      status: l.toStatus,
    })),
    createdAt: order.createdAt,
  }
}

export async function cancelOrder(orderId: number, userId: number) {
  const order = await prisma.order.findFirst({
    where: { id: BigInt(orderId), userId: BigInt(userId) },
  })
  if (!order) throw new AppError(ErrorCodes.ORDER_NOT_FOUND, '订单不存在')
  if (order.status !== 'pending_pay') throw new AppError(ErrorCodes.ORDER_CANNOT_CANCEL, '当前状态不可取消')

  await prisma.order.update({
    where: { id: BigInt(orderId) },
    data: {
      status: 'cancelled',
      cancelTime: new Date(),
      statusLogs: {
        create: { orderNo: order.orderNo, fromStatus: 'pending_pay', toStatus: 'cancelled', operatorType: 'user', operatorId: BigInt(userId) },
      },
    },
  })
  return { orderId: Number(order.id), status: 'cancelled' }
}
