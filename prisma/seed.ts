import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('开始初始化数据...')

  // 检查是否已有数据，如果有则跳过（防止覆盖用户数据）
  const existingUsers = await prisma.user.count()
  if (existingUsers > 0) {
    console.log('⚠️ 数据库已有数据，跳过初始化（防止覆盖用户修改）')
    console.log('如需重置数据，请先手动清空数据库后再运行种子脚本')
    return
  }

  // 1. 创建管理员账户
  const hashedPassword = await bcrypt.hash('12345678955555', 10)
  const admin = await prisma.user.create({
    data: {
      email: '2533731189@qq.com',
      password: hashedPassword,
      name: '茶杯',
    },
  })
  console.log('✅ 管理员账户创建成功:', admin.email)

  // 2. 网站配置（只保留 general / footer）
  const siteConfigs = [
    { key: 'site_title',        value: '茶杯—作品集',           group: 'general', label: '网站标题' },
    { key: 'site_subtitle',     value: 'Personal Portfolio',     group: 'general', label: '首页副标题' },
    { key: 'site_description',  value: '欢迎来到我的个人作品集，这里收录了我的各类创作作品。', group: 'general', label: '首页描述文字' },
    { key: 'hero_button_text',  value: '浏览作品',            group: 'general', label: '首页按钮文字' },
    { key: 'site_logo_text',    value: '作品首页',             group: 'general', label: '左上角网站名称' },

    // 页脚
    { key: 'footer_title',     value: '联系方式，各平台账号，作品版权说明', group: 'footer', label: '页脚标题' },
    { key: 'footer_content',   value: '© 2024 茶杯\n电子邮箱：2533731189@qq.com\n哔哩哔哩：画画的茶杯\n小红书：画画的茶杯', group: 'footer', label: '页脚内容' },
  ]

  for (const config of siteConfigs) {
    await prisma.siteConfig.create({ data: config })
  }
  console.log('✅ 网站配置初始化成功')

  // 3. 创建分类（先大类，后小类）
  const categoryData = [
    // 大类
    { name: '绘画',   slug: 'painting',     parentName: null },
    { name: '动画',   slug: 'animation',   parentName: null },
    { name: '建模',   slug: 'modeling',     parentName: null },
    { name: '游戏',   slug: 'game',         parentName: null },
    { name: '小说',   slug: 'novel',        parentName: null },
    { name: '音乐',   slug: 'music',        parentName: null },
    // 小类
    { name: '油画',     slug: 'oil-painting',       parentName: '绘画' },
    { name: '水墨画',   slug: 'ink-painting',       parentName: '绘画' },
    { name: '厚涂',     slug: '厚涂',              parentName: '绘画' },
    { name: '2D动画',   slug: '2d-animation',      parentName: '动画' },
    { name: '3D动画',   slug: '3d-animation',      parentName: '动画' },
    { name: '角色建模', slug: 'character-modeling', parentName: '建模' },
    { name: '场景建模', slug: 'environment-modeling', parentName: '建模' },
    { name: '第三人称游戏', slug: 'indie-game',    parentName: '游戏' },
    { name: '横版游戏', slug: '横版游戏',          parentName: '游戏' },
    { name: '短篇小说', slug: 'short-story',         parentName: '小说' },
    { name: '纯音乐',   slug: '纯音乐',            parentName: '音乐' },
  ]

  // 先创建所有大类
  const parentMap: Record<string, string> = {}
  for (const cat of categoryData) {
    if (!cat.parentName) {
      const created = await prisma.category.create({
        data: { name: cat.name, slug: cat.slug, parentId: null, sortOrder: categoryData.indexOf(cat) },
      })
      parentMap[cat.name] = created.id
      console.log(`  ✓ 大类: ${cat.name}`)
    }
  }

  // 再创建所有小类
  for (const cat of categoryData) {
    if (cat.parentName) {
      const parentId = parentMap[cat.parentName]
      if (parentId) {
        await prisma.category.create({
          data: { name: cat.name, slug: cat.slug, parentId, sortOrder: categoryData.indexOf(cat) },
        })
        console.log(`  ✓ 小类: ${cat.name}（隶属于 ${cat.parentName}）`)
      }
    }
  }
  console.log('✅ 分类数据创建成功')

  console.log('🎉 数据初始化完成！')
  console.log('📝 管理员登录信息：')
  console.log('   邮箱: 2533731189@qq.com')
  console.log('   密码: 12345678955555')
}

main()
  .catch((e) => {
    console.error('❌ 初始化失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
