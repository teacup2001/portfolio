import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const works = await prisma.work.findMany({
      orderBy: { date: 'desc' },
      include: { 
        category: {
          include: { parent: true }
        }
      },
    })
    
    // 格式化返回数据，添加 parentCategory
    const formatted = works.map(w => ({
      id: w.id,
      title: w.title,
      slug: w.slug,
      category: {
        name: w.category.name,
      },
      parentCategory: w.category.parent ? {
        name: w.category.parent.name,
      } : null,
      updatedAt: w.updatedAt.toISOString(),
    }))
    
    return NextResponse.json(formatted)
  } catch (error) {
    console.error('获取作品列表失败：', error)
    return NextResponse.json({ error: '获取数据失败' }, { status: 500 })
  }
}
