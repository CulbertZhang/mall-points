import { PrismaClient } from '@prisma/client'
import { AppError, ErrorCodes } from '../utils/errors'

const prisma = new PrismaClient()

export async function getMemberInfo(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: BigInt(userId) },
    include: { memberLevel: true, pointsAccount: true },
  })
  if (!user) throw new AppError(ErrorCodes.ACCOUNT_NOT_FOUND, '用户不存在')

  const level = user.memberLevel
  const nextLevel = level
    ? await prisma.memberLevel.findFirst({
        where: { levelRank: { gt: level.levelRank } },
        orderBy: { levelRank: 'asc' },
      })
    : await prisma.memberLevel.findFirst({ where: { levelRank: 1 }, orderBy: { levelRank: 'asc' } })

  return {
    userId: Number(user.id),
    nickname: user.nickname,
    avatar: user.avatarUrl,
    memberLevel: level?.levelRank || 0,
    memberLevelName: level?.levelName || '普通会员',
    memberLevelIcon: level?.iconUrl || '',
    growthValue: user.growthValue,
    nextLevelGrowth: nextLevel?.minGrowthValue || 0,
    pointsBalance: user.pointsAccount?.balance || 0,
    allLevels: (await prisma.memberLevel.findMany({ orderBy: { levelRank: 'asc' } })).map(l => ({
      level: l.levelRank,
      name: l.levelName,
      icon: l.iconUrl,
      minGrowth: l.minGrowthValue,
      discountRate: l.discountRate,
    })),
  }
}

export async function getGrowthRecords(userId: number, page = 1, pageSize = 20) {
  // Phase 1: growth_value_transactions table not yet implemented, return empty
  return { list: [], pagination: { page, pageSize, total: 0, totalPages: 0 } }
}

export async function getSignInStatus(userId: number) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const record = await prisma.signInRecord.findFirst({
    where: { userId: BigInt(userId), signDate: today },
  })
  return { todaySigned: !!record, consecutiveDays: record?.consecutiveDays || 0 }
}

export async function signIn(userId: number) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const existing = await prisma.signInRecord.findFirst({
    where: { userId: BigInt(userId), signDate: today },
  })
  if (existing) throw new AppError(ErrorCodes.SIGNIN_ALREADY_DONE, '今日已签到')

  // Check yesterday for consecutive count
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayRecord = await prisma.signInRecord.findFirst({
    where: { userId: BigInt(userId), signDate: yesterday },
  })

  const consecutiveDays = (yesterdayRecord?.consecutiveDays || 0) + 1

  // Calculate points: base 10, bonus for streaks
  let points = 10
  if (consecutiveDays >= 7) points = 50
  else if (consecutiveDays >= 5) points = 20
  else if (consecutiveDays >= 3) points = 15

  await prisma.signInRecord.create({
    data: { userId: BigInt(userId), signDate: today, consecutiveDays, pointsEarned: points },
  })

  // Update points account
  await prisma.pointsAccount.upsert({
    where: { userId: BigInt(userId) },
    update: { balance: { increment: points }, totalEarned: { increment: points } },
    create: { userId: BigInt(userId), balance: points, totalEarned: points },
  })

  return {
    todayBonus: points,
    consecutiveDays,
    totalEarned: points,
    balance: (await prisma.pointsAccount.findUnique({ where: { userId: BigInt(userId) } }))?.balance || points,
  }
}

export async function getAddresses(userId: number) {
  const addresses = await prisma.userAddress.findMany({
    where: { userId: BigInt(userId), deletedAt: null },
    orderBy: [{ isDefault: 'desc' }, { updatedAt: 'desc' }],
  })
  return addresses.map(a => ({
    id: Number(a.id),
    receiverName: a.receiverName,
    phone: a.receiverPhone,
    province: a.province,
    city: a.city,
    district: a.district,
    detail: a.detailAddress,
    isDefault: a.isDefault,
    label: a.addressTag,
  }))
}

export async function createAddress(userId: number, data: {
  receiverName: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  isDefault?: boolean
  label?: string
}) {
  if (data.isDefault) {
    await prisma.userAddress.updateMany({
      where: { userId: BigInt(userId), isDefault: true },
      data: { isDefault: false },
    })
  }
  const count = await prisma.userAddress.count({ where: { userId: BigInt(userId), deletedAt: null } })
  const addr = await prisma.userAddress.create({
    data: {
      userId: BigInt(userId),
      receiverName: data.receiverName,
      receiverPhone: data.phone,
      province: data.province,
      city: data.city,
      district: data.district,
      detailAddress: data.detail,
      isDefault: count === 0 || data.isDefault || false,
      addressTag: data.label || 'home',
    },
  })
  return { id: Number(addr.id), ...data, isDefault: addr.isDefault }
}

export async function updateAddress(addressId: number, userId: number, data: Record<string, unknown>) {
  await prisma.userAddress.updateMany({
    where: { id: BigInt(addressId), userId: BigInt(userId), deletedAt: null },
    data: data as any,
  })
  return { id: addressId }
}

export async function deleteAddress(addressId: number, userId: number) {
  await prisma.userAddress.updateMany({
    where: { id: BigInt(addressId), userId: BigInt(userId) },
    data: { deletedAt: new Date() },
  })
  return { deleted: true }
}
