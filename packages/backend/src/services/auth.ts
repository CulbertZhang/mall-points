import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { signAccessToken, signRefreshToken } from '../utils/jwt'
import { AppError, ErrorCodes } from '../utils/errors'

const prisma = new PrismaClient()

export async function register(phone: string, password: string, nickname?: string) {
  const existing = await prisma.user.findUnique({ where: { phone } })
  if (existing) throw new AppError(ErrorCodes.PHONE_REGISTERED, '手机号已注册')

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: {
      username: `u_${phone}`,
      passwordHash,
      phone,
      nickname: nickname || `用户${phone.slice(-4)}`,
      pointsAccount: { create: { balance: 0 } },
    },
  })

  const payload = { userId: Number(user.id), username: user.username }
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
    expiresIn: 7200,
    userInfo: {
      userId: Number(user.id),
      nickname: user.nickname,
      avatar: user.avatarUrl,
      phone: phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
      memberLevel: 0,
      memberLevelName: '普通会员',
    },
  }
}

export async function login(account: string, password: string) {
  const user = await prisma.user.findFirst({
    where: { OR: [{ phone: account }, { username: account }] },
  })
  if (!user) throw new AppError(ErrorCodes.ACCOUNT_NOT_FOUND, '账号不存在')
  if (user.status !== 1) throw new AppError(ErrorCodes.ACCOUNT_DISABLED, '账号已被禁用')

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) throw new AppError(ErrorCodes.WRONG_PASSWORD, '密码错误')

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  })

  const payload = { userId: Number(user.id), username: user.username }
  const level = user.memberLevelId
    ? await prisma.memberLevel.findUnique({ where: { id: user.memberLevelId! } })
    : null

  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
    expiresIn: 7200,
    userInfo: {
      userId: Number(user.id),
      nickname: user.nickname,
      avatar: user.avatarUrl,
      phone: user.phone?.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') || '',
      memberLevel: level?.levelRank || 0,
      memberLevelName: level?.levelName || '普通会员',
    },
  }
}

export async function getProfile(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: BigInt(userId) },
    include: { memberLevel: true, pointsAccount: true },
  })
  if (!user) throw new AppError(ErrorCodes.ACCOUNT_NOT_FOUND, '用户不存在')

  const couponCount = 0 // TODO: add coupons table
  return {
    userId: Number(user.id),
    nickname: user.nickname,
    avatar: user.avatarUrl,
    phone: user.phone?.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') || '',
    gender: user.gender,
    birthday: user.birthday,
    memberLevel: user.memberLevel?.levelRank || 0,
    memberLevelName: user.memberLevel?.levelName || '普通会员',
    growthValue: user.growthValue,
    pointsBalance: user.pointsAccount?.balance || user.pointsBalance,
    couponCount,
  }
}
