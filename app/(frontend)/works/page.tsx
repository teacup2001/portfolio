import { prisma } from '@/lib/prisma'
import WorksClient from './WorksClient'

export default async function WorksPage() {
  // 获取所有分类（包括子分类）
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { children: true }
  })
  
  // 获取所有分类（用于查找父类）
  const allCategories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' }
  })
  
  // 获取所有作品（首屏加载）
  const works = await prisma.work.findMany({
    orderBy: { date: 'desc' },
    include: { 
      category: true, 
      medias: { take: 1, orderBy: { sortOrder: 'asc' } }
    },
  })
  
  return (
    <WorksClient 
      categories={categories} 
      allCategories={allCategories}
      initialWorks={works}
    />
  )
}
