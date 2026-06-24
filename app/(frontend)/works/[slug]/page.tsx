import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import VideoEmbed from './VideoEmbed'

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const work = await prisma.work.findUnique({
    where: { slug },
    include: {
      category: true,
      medias: { orderBy: { sortOrder: 'asc' } },
      embeds: { orderBy: { sortOrder: 'asc' } },
    },
  })

  if (!work) notFound()

  // 分离视频和音频嵌入
  const videoEmbeds = work.embeds.filter(e => e.type === 'VIDEO')
  const audioEmbeds = work.embeds.filter(e => e.type === 'AUDIO')

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* 返回链接 */}
      <Link
        href="/works"
        className="inline-flex items-center gap-1 text-sm text-[#9ca3af] hover:text-[#1a1a1a] transition-colors mb-8"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        返回作品列表
      </Link>

      {/* 标题和日期 */}
      <h1 className="font-serif text-2xl font-semibold text-[#1a1a1a] mb-2">
        {work.title}
      </h1>
      <p className="text-[12px] text-[#ccc] tracking-wide mb-8">
        {work.category.name} · {new Date(work.date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' })}
      </p>

      {/* 多图画廊 */}
      {work.medias.length > 0 && (
        <div className="mb-10 space-y-4">
          {work.medias.map((img, i) => (
            <div key={img.id} className="w-full">
              <img
                src={img.url}
                alt={`${work.title} - 图 ${i + 1}`}
                className="w-full h-auto bg-[#f5f5f5]"
              />
            </div>
          ))}
        </div>
      )}

      {/* 多视频嵌入 */}
      {videoEmbeds.length > 0 && (
        <div className="mb-10">
          <h2 className="text-sm font-medium text-[#1a1a1a] mb-4 tracking-wide uppercase">视频</h2>
          <div className="space-y-6">
            {videoEmbeds.map((emb, i) => (
              <VideoEmbed key={emb.id} embedCode={emb.embedCode} title={emb.title || undefined} />
            ))}
          </div>
        </div>
      )}

      {/* 多音频嵌入 */}
      {audioEmbeds.length > 0 && (
        <div className="mb-10">
          <h2 className="text-sm font-medium text-[#1a1a1a] mb-4 tracking-wide uppercase">音频</h2>
          <div className="space-y-4">
            {audioEmbeds.map((emb, i) => (
              <div key={emb.id}>
                {emb.title && (
                  <p className="text-[13px] text-[#888] mb-2">{emb.title}</p>
                )}
                <div
                  className="audio-embed-wrapper"
                  dangerouslySetInnerHTML={{ __html: emb.embedCode }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 文本正文 - 18px */}
      {work.textBody && (
        <div className="mb-10">
          <div className="text-[18px] text-[#333] leading-relaxed whitespace-pre-wrap">
            {work.textBody}
          </div>
        </div>
      )}
    </div>
  )
}
