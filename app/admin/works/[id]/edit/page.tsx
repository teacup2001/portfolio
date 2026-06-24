import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import WorkForm from '../../WorkForm'

export default async function EditWorkPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [work, categories] = await Promise.all([
    prisma.work.findUnique({
      where: { id },
      include: {
        medias: { orderBy: { sortOrder: 'asc' } },
        embeds: { orderBy: { sortOrder: 'asc' } },
      },
    }),
    prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { children: true },
    }),
  ])

  if (!work) notFound()

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
        编辑作品
      </h1>

      <WorkForm
        mode="edit"
        workId={id}
        defaultTitle={work.title}
        defaultCategoryId={work.categoryId}
        defaultDate={new Date(work.date).toISOString().split('T')[0]}
        defaultTextBody={work.textBody || ''}
        defaultMedias={work.medias.map(m => ({ id: m.id, url: m.url, sortOrder: m.sortOrder }))}
        defaultEmbeds={work.embeds.map(e => ({ id: e.id, type: e.type, title: e.title || '', embedCode: e.embedCode, sortOrder: e.sortOrder }))}
        categories={categories}
      />
    </div>
  )
}
