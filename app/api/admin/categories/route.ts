import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  // 获取所有分类
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      children: true, // 获取子类
      parent: true, // 获取父类
    },
  })
  
  // 计算大类数和小类数
  const parentCategories = categories.filter(c => !c.parentId)
  const childCategories = categories.filter(c => c.parentId)
  
  // 格式化返回数据
  const formatted = categories.map(c => ({
    id: c.id,
    name: c.name,
    parentId: c.parentId,
    sortOrder: c.sortOrder,
    children: c.children.map(child => ({
      id: child.id,
      name: child.name,
      parentId: child.parentId,
      sortOrder: child.sortOrder,
      children: [], // 小类没有子类
    })),
  }))
  
  return NextResponse.json({
    categories: formatted,
    stats: {
      parentCount: parentCategories.length,
      childCount: childCategories.length,
    },
  })
}
