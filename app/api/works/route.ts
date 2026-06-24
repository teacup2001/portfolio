import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取作品列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('category')
    const childId = searchParams.get('child')
    
    let where: any = {}
    
    if (categoryId) {
      if (childId) {
        where.categoryId = childId
      } else {
        const cat = await prisma.category.findUnique({ where: { id: categoryId } })
        if (cat && !cat.parentId) {
          const children = await prisma.category.findMany({ where: { parentId: categoryId } })
          const childIds = children.map(c => c.id)
          where.categoryId = { in: [categoryId, ...childIds] }
        } else {
          where.categoryId = categoryId
        }
      }
    }
    
    const works = await prisma.work.findMany({
      orderBy: { date: 'desc' },
      include: { category: true },
    })
    
    return NextResponse.json(works)
  } catch (error) {
    console.error('获取作品列表失败：', error)
    return NextResponse.json({ error: '获取数据失败' }, { status: 500 })
  }
}
