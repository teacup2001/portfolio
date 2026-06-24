import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import WorkForm from '../WorkForm'

export default async function NewWorkPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { children: true },
  })
  
  return (
    <div className="fade-in max-w-2xl">
      <Link
        href="/admin/works"
        className="inline-flex items-center gap-1 text-sm text-[#9ca3af] hover:text-[#1a1a1a] transition-colors mb-6"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        返回
      </Link>

      <h1 className="font-serif text-2xl font-semibold text-[#1a1a1a] mb-8">
        新建作品
      </h1>

      <WorkForm
        mode="new"
        categories={categories}
      />
    </div>
  )
}
