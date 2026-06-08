import { Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'
import { success } from '../utils/response'

const prisma = new PrismaClient()

export async function banners(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await prisma.banner.findMany({
      where: { isEnabled: true, position: 'home' },
      orderBy: { sortOrder: 'asc' },
    })
    success(res, data.map(b => ({
      id: Number(b.id),
      title: b.title,
      imageUrl: b.imageUrl,
      linkType: b.linkType,
      linkValue: b.linkValue,
    })))
  } catch (err) { next(err) }
}

export async function navigations(req: Request, res: Response, next: NextFunction) {
  try {
    const position = (req.query.position as string) || 'home'
    const data = await prisma.navigation.findMany({
      where: { isEnabled: true, position },
      orderBy: { sortOrder: 'asc' },
    })
    success(res, data.map(n => ({
      id: Number(n.id),
      name: n.name,
      iconUrl: n.iconUrl,
      linkType: n.linkType,
      linkValue: n.linkValue,
    })))
  } catch (err) { next(err) }
}
