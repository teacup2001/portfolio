import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

interface DeleteWorkPageProps {
  params: Promise<{ id: string }>
}

export default async function DeleteWorkPage({ params }: DeleteWorkPageProps) {
  const { id } = await params
  const work = await prisma.work.findUnique({ where: { id } })

  if (!work) redirect('/admin/works')

  // Server Action：删除作品
  const deleteWork = async () => {
    'use server'
    await prisma.work.delete({ where: { id } })
    revalidatePath('/admin/works')
    redirect('/admin/works')
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white border border-[#e5e5e5] text-center">
      <h2 className="text-lg font-serif text-[#1a1a1a] mb-3">确认删除</h2>
      <p className="text-sm text-[#6b7280] mb-6">
        确定删除作品「{work.title}」吗？此操作不可撤销。
      </p>
      <div className="flex items-center justify-center gap-3">
        <form action={deleteWork}>
          <button
            type="submit"
            className="px-5 py-2 bg-red-500 text-white text-sm hover:bg-red-600 transition-colors"
          >
            确认删除
          </button>
        </form>
        <a
          href="/admin/works"
          className="px-5 py-2 border border-[#e5e5e5] text-sm text-[#6b7280] hover:border-[#1a1a1a] transition-colors inline-block no-underline"
        >
          取消
        </a>
      </div>
    </div>
  )
}
