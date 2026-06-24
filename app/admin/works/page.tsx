import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function AdminWorksPage() {
  const works = await prisma.work.findMany({
    orderBy: { date: 'desc' },
    include: { category: true },
  })

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-2xl font-semibold text-[#1a1a1a]">
          作品管理
        </h1>
        <Link
          href="/admin/works/new"
          className="text-sm px-4 py-2 bg-[#1a1a1a] text-white hover:bg-[#333] transition-colors"
        >
          新建作品
        </Link>
      </div>

      <div className="bg-white border border-[#e5e5e5] divide-y divide-[#e5e5e5]">
        {works.length === 0 ? (
          <p className="p-6 text-sm text-[#9ca3af] text-center">
            暂无作品，请先创建。
          </p>
        ) : (
          works.map((work) => (
            <div
              key={work.id}
              className="flex items-center justify-between px-5 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm text-[#1a1a1a] truncate">{work.title}</p>
                <p className="text-xs text-[#9ca3af] mt-0.5">
                  {work.category.name} ·{' '}
                  {new Date(work.date).toLocaleDateString('zh-CN')}
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs shrink-0 ml-4">
                <Link
                  href={`/admin/works/${work.id}/edit`}
                  className="text-[#6b7280] hover:text-[#1a1a1a] transition-colors"
                >
                  编辑
                </Link>
                <Link
                  href={`/admin/works/${work.id}/delete`}
                  className="text-[#6b7280] hover:text-red-500 transition-colors"
                >
                  删除
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
