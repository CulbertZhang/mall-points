import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const logoMap: Record<string, string> = {
  '爱奇艺黄金VIP月卡': '/logos/iqiyi.svg',
  '爱奇艺黄金VIP年卡': '/logos/iqiyi.svg',
  '优酷VIP会员月卡': '/logos/youku.svg',
  '腾讯视频VIP月卡': '/logos/tencentvideo.svg',
  '芒果TV全屏会员月卡': '/logos/mgtv.svg',
  'B站大会员月卡': '/logos/bilibili.svg',
  'QQ音乐豪华绿钻月卡': '/logos/qqmusic.svg',
  '网易云音乐黑胶VIP月卡': '/logos/neteasemusic.svg',
  '酷狗音乐VIP月卡': '/logos/kugou.svg',
  'WPS超级会员月卡': '/logos/wps.svg',
  '百度网盘超级会员月卡': '/logos/baidupan.svg',
  '阿里云盘扩容包200G/年': '/logos/alipan.svg',
  'Keep会员月卡': '/logos/keep.svg',
  '美团外卖月度神券包': '/logos/meituan.svg',
  '滴滴出行月度打车券包': '/logos/didi.svg',
}

async function main() {
  const products = await prisma.product.findMany()

  for (const p of products) {
    const logo = logoMap[p.name]
    if (!logo) continue

    await prisma.product.update({
      where: { id: p.id },
      data: { mainImageUrl: logo },
    })
    await prisma.productSku.updateMany({
      where: { productId: p.id },
      data: { imageUrl: logo },
    })
    await prisma.productImage.updateMany({
      where: { productId: p.id },
      data: { imageUrl: logo },
    })
    console.log(`✅ ${p.name} → ${logo}`)
  }

  console.log('Done!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
