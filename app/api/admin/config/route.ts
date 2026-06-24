import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取网站配置
export async function GET(request: NextRequest) {
  try {
    const configs = await prisma.siteConfig.findMany({ orderBy: { group: 'asc' } })
    
    // 按分组整理
    const IGNORE_GROUPS = new Set(['home', 'nav', 'work', 'about'])
    const IGNORE_KEYS = new Set(['footer_copyright', 'footer_contact'])
    
    const groups = configs.reduce((acc: Record<string, typeof configs>, c) => {
      if (IGNORE_GROUPS.has(c.group)) return acc
      if (IGNORE_KEYS.has(c.key)) return acc
      ;(acc[c.group] ||= []).push(c)
      return acc
    }, {})
    
    return NextResponse.json(groups)
  } catch (error) {
    console.error('获取网站配置失败：', error)
    return NextResponse.json({ error: '获取数据失败' }, { status: 500 })
  }
}

// 更新网站配置
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    
    for (const [key, value] of Object.entries(data)) {
      await prisma.siteConfig.updateMany({
        where: { key },
        data: { value: String(value) },
      })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('更新网站配置失败：', error)
    return NextResponse.json({ error: '更新失败' }, { status: 500 })
  }
}
