import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🧹 Cleaning database...')

  await prisma.orderStatusLog.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.shoppingCart.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.productSku.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.signInRecord.deleteMany()
  await prisma.pointsAccount.deleteMany()
  await prisma.userAddress.deleteMany()
  await prisma.user.deleteMany()
  await prisma.navigation.deleteMany()
  await prisma.banner.deleteMany()
  await prisma.announcement.deleteMany()
  await prisma.memberLevel.deleteMany()

  console.log('🌱 Seeding 澄心惠享商城...')

  // Member levels
  await prisma.memberLevel.createMany({
    data: [
      { levelCode: 'VIP1', levelName: '普通会员', levelRank: 1, minGrowthValue: 0, maxGrowthValue: 999, discountRate: 1.00, pointsMultiplier: 1.00, sortOrder: 1 },
      { levelCode: 'VIP2', levelName: '白银会员', levelRank: 2, minGrowthValue: 1000, maxGrowthValue: 4999, discountRate: 0.95, pointsMultiplier: 1.20, sortOrder: 2 },
      { levelCode: 'VIP3', levelName: '黄金会员', levelRank: 3, minGrowthValue: 5000, maxGrowthValue: 19999, discountRate: 0.90, pointsMultiplier: 1.50, sortOrder: 3 },
      { levelCode: 'VIP4', levelName: '钻石会员', levelRank: 4, minGrowthValue: 20000, maxGrowthValue: 999999, discountRate: 0.85, pointsMultiplier: 2.00, sortOrder: 4 },
    ],
    skipDuplicates: true,
  })

  // Categories - virtual products
  const cat1 = await prisma.category.create({ data: { name: '视频会员', iconUrl: '🎬', level: 1, path: '1', isLeaf: false, sortOrder: 1 } })
  const cat1Id = Number(cat1.id)
  const cat11 = await prisma.category.create({ data: { parentId: cat1.id, name: '长视频', level: 2, path: `${cat1Id}/${cat1Id + 1}`, sortOrder: 1 } })
  const cat12 = await prisma.category.create({ data: { parentId: cat1.id, name: '短视频', level: 2, path: `${cat1Id}/${cat1Id + 2}`, sortOrder: 2 } })

  const cat2 = await prisma.category.create({ data: { name: '音乐会员', iconUrl: '🎵', level: 1, path: '2', isLeaf: false, sortOrder: 2 } })
  const cat2Id = Number(cat2.id)
  const cat21 = await prisma.category.create({ data: { parentId: cat2.id, name: '音乐平台', level: 2, path: `${cat2Id}/${cat2Id + 1}`, sortOrder: 1 } })

  const cat3 = await prisma.category.create({ data: { name: '工具会员', iconUrl: '🔧', level: 1, path: '3', isLeaf: false, sortOrder: 3 } })
  const cat3Id = Number(cat3.id)
  const cat31 = await prisma.category.create({ data: { parentId: cat3.id, name: '办公工具', level: 2, path: `${cat3Id}/${cat3Id + 1}`, sortOrder: 1 } })
  const cat32 = await prisma.category.create({ data: { parentId: cat3.id, name: '网盘存储', level: 2, path: `${cat3Id}/${cat3Id + 2}`, sortOrder: 2 } })

  const cat4 = await prisma.category.create({ data: { name: '生活权益', iconUrl: '🎁', level: 1, path: '4', isLeaf: false, sortOrder: 4 } })
  const cat4Id = Number(cat4.id)
  const cat41 = await prisma.category.create({ data: { parentId: cat4.id, name: '健身运动', level: 2, path: `${cat4Id}/${cat4Id + 1}`, sortOrder: 1 } })
  const cat42 = await prisma.category.create({ data: { parentId: cat4.id, name: '外卖出行', level: 2, path: `${cat4Id}/${cat4Id + 2}`, sortOrder: 2 } })

  // Products - virtual memberships
  const products = [
    { name: '爱奇艺黄金VIP月卡', subtitle: '热剧综艺抢先看 广告自动跳过', categoryId: cat11.id, price: 25, originalPrice: 30, stock: 9999, tags: ['hot'] },
    { name: '爱奇艺黄金VIP年卡', subtitle: '连续包年更划算 全年畅看', categoryId: cat11.id, price: 218, originalPrice: 258, stock: 9999, tags: ['recommend'] },
    { name: '优酷VIP会员月卡', subtitle: '海量影视 跳广告 1080P画质', categoryId: cat11.id, price: 25, originalPrice: 30, stock: 9999, tags: ['hot'] },
    { name: '腾讯视频VIP月卡', subtitle: '超前点播 杜比画质 跳广告', categoryId: cat11.id, price: 25, originalPrice: 30, stock: 9999, tags: ['hot'] },
    { name: '芒果TV全屏会员月卡', subtitle: '综艺独播 手机电视通用', categoryId: cat11.id, price: 22, originalPrice: 28, stock: 9999, tags: ['new'] },
    { name: 'B站大会员月卡', subtitle: '番剧抢先 画质升级 专属表情', categoryId: cat12.id, price: 25, originalPrice: 25, stock: 9999, tags: ['new'] },
    { name: 'QQ音乐豪华绿钻月卡', subtitle: '千万曲库 无损音质 付费歌曲免费听', categoryId: cat21.id, price: 15, originalPrice: 18, stock: 9999, tags: ['hot'] },
    { name: '网易云音乐黑胶VIP月卡', subtitle: '黑胶专属音效 每日推荐提升', categoryId: cat21.id, price: 15, originalPrice: 18, stock: 9999, tags: ['hot'] },
    { name: '酷狗音乐VIP月卡', subtitle: '无损下载 专属皮肤 去广告', categoryId: cat21.id, price: 12, originalPrice: 15, stock: 9999, tags: [] },
    { name: 'WPS超级会员月卡', subtitle: 'PDF转换 云空间 AI写作 全功能', categoryId: cat31.id, price: 21, originalPrice: 30, stock: 9999, tags: ['recommend'] },
    { name: '百度网盘超级会员月卡', subtitle: '极速下载 5T空间 在线解压', categoryId: cat32.id, price: 25, originalPrice: 30, stock: 9999, tags: ['hot'] },
    { name: '阿里云盘扩容包200G/年', subtitle: '不限速下载 相册备份 多端同步', categoryId: cat32.id, price: 59, originalPrice: 69, stock: 9999, tags: [] },
    { name: 'Keep会员月卡', subtitle: '专属课程 数据分析 运动计划定制', categoryId: cat41.id, price: 19, originalPrice: 25, stock: 9999, tags: ['new'] },
    { name: '美团外卖月度神券包', subtitle: '每周无门槛红包 满减叠加使用', categoryId: cat42.id, price: 9.9, originalPrice: 15, stock: 9999, tags: ['hot', 'recommend'] },
    { name: '滴滴出行月度打车券包', subtitle: '每周折扣券 快车专车通用', categoryId: cat42.id, price: 12.9, originalPrice: 20, stock: 9999, tags: [] },
  ]

  for (const p of products) {
    const product = await prisma.product.create({
      data: {
        spuCode: `SPU${Date.now()}${Math.random().toString(36).slice(2, 5)}`,
        categoryId: p.categoryId,
        name: p.name,
        subtitle: p.subtitle,
        mainImageUrl: `https://picsum.photos/400/400?random=${Math.floor(Math.random() * 10000)}`,
        detailHtml: `<div style="padding:16px"><h3>${p.name}</h3><p style="color:#666;margin-top:8px">${p.subtitle}</p><p style="margin-top:12px;color:#999">购买后自动发放至您的账户，虚拟商品一经兑换不支持退款。</p></div>`,
        minPrice: p.price,
        maxPrice: p.originalPrice,
        totalStock: p.stock,
        salesCount: Math.floor(Math.random() * 20000) + 1000,
        onsaleStatus: 1,
        tags: p.tags,
        unit: '张',
      },
    })

    await prisma.productSku.create({
      data: {
        productId: product.id,
        skuCode: `SKU${product.id}_DEFAULT`,
        skuName: '标准版',
        specInfo: {},
        imageUrl: product.mainImageUrl,
        price: p.price,
        originalPrice: p.originalPrice,
        stock: p.stock,
      },
    })

    await prisma.productImage.create({
      data: {
        productId: product.id,
        imageUrl: product.mainImageUrl,
        sortOrder: 1,
        isMain: true,
      },
    })
  }

  // Banners
  await prisma.banner.createMany({
    data: [
      { title: '权益狂欢月', imageUrl: 'https://picsum.photos/750/340?random=101', linkType: 'url', linkValue: '/home', position: 'home', sortOrder: 1 },
      { title: '视频会员5折起', imageUrl: 'https://picsum.photos/750/340?random=102', linkType: 'url', linkValue: '/categories', position: 'home', sortOrder: 2 },
      { title: '新人专享 签到领积分', imageUrl: 'https://picsum.photos/750/340?random=103', linkType: 'url', linkValue: '/signin', position: 'home', sortOrder: 3 },
    ],
  })

  // Navigation entries
  const entries = [
    { name: '每日签到', linkType: 'page', linkValue: '/signin', position: 'home', sortOrder: 1 },
    { name: '积分兑换', linkType: 'page', linkValue: '/points-mall', position: 'home', sortOrder: 2 },
    { name: '视频会员', linkType: 'page', linkValue: '/categories', position: 'home', sortOrder: 3 },
    { name: '音乐会员', linkType: 'page', linkValue: '/categories', position: 'home', sortOrder: 4 },
    { name: '工具特惠', linkType: 'page', linkValue: '/categories', position: 'home', sortOrder: 5 },
  ]
  for (const e of entries) {
    await prisma.navigation.create({ data: e })
  }

  // Demo user
  const hash = await bcrypt.hash('123456', 10)
  await prisma.user.upsert({
    where: { phone: '13800138000' },
    update: {},
    create: {
      username: 'demo',
      passwordHash: hash,
      nickname: '澄心用户',
      phone: '13800138000',
      memberLevelId: (await prisma.memberLevel.findUnique({ where: { levelCode: 'VIP2' } }))!.id,
      growthValue: 2500,
      pointsBalance: 3680,
      totalPointsEarned: 8000,
      pointsAccount: { create: { balance: 3680, totalEarned: 8000 } },
    },
  })

  console.log('✅ 澄心惠享商城 seed complete!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
