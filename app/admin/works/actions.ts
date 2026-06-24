'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

interface WorkPayload {
  title: string
  categoryId: string
  date: string
  textBody: string | null
  images: { id?: string; url: string; sortOrder: number }[]
  embeds: { id?: string; type: 'VIDEO' | 'AUDIO'; title: string | null; embedCode: string; sortOrder: number }[]
}

// 清理嵌入代码：移除自动播放参数
function sanitizeEmbedCode(embedCode: string): string {
  return embedCode
    // 处理 auto=1 (网易云音乐等)
    .replace(/auto=1/g, 'auto=0')
    .replace(/auto="1"/g, 'auto="0"')
    // 处理 autoplay=1 (通用)
    .replace(/autoplay=1/g, 'autoplay=0')
    .replace(/autoplay="1"/g, 'autoplay="0"')
    // 清理多余的参数
    .replace(/&auto=0&/g, '&')
    .replace(/&auto=0$/g, '')
    .replace(/\?auto=0&/g, '?')
    .replace(/\?auto=0$/g, '')
    .replace(/&autoplay=0&/g, '&')
    .replace(/&autoplay=0$/g, '')
    .replace(/\?autoplay=0&/g, '?')
    .replace(/\?autoplay=0$/g, '')
}

// 生成 URL 友好的 slug
function generateSlug(title: string): string {
  // 尝试生成 ASCII slug
  let slug = title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '') // 只保留字母、数字、下划线、连字符
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
  
  // 如果 slug 为空（比如中文标题），生成随机 slug
  if (!slug) {
    slug = `work-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`
  }
  
  return slug
}

// 确保 slug 唯一
async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug
  let counter = 1
  
  while (await prisma.work.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`
    counter++
  }
  
  return slug
}

// 创建作品
export async function createWork(payload: WorkPayload) {
  const baseSlug = generateSlug(payload.title)
  const slug = await ensureUniqueSlug(baseSlug)

  const work = await prisma.work.create({
    data: {
      title: payload.title,
      slug,
      date: new Date(payload.date),
      textBody: payload.textBody,
      categoryId: payload.categoryId,
    },
  })

  // 保存图片
  for (const img of payload.images) {
    await prisma.media.create({
      data: {
        workId: work.id,
        url: img.url,
        sortOrder: img.sortOrder,
      },
    })
  }

  // 保存嵌入代码
  for (const emb of payload.embeds) {
    await prisma.embed.create({
      data: {
        workId: work.id,
        type: emb.type,
        title: emb.title,
        embedCode: sanitizeEmbedCode(emb.embedCode),
        sortOrder: emb.sortOrder,
      },
    })
  }

  revalidatePath('/works')
  revalidatePath(`/works/${slug}`)
  redirect('/admin/works')
}

// 更新作品
export async function updateWork(id: string, payload: WorkPayload) {
  // 获取现有作品，保留原 slug（避免破坏已有链接）
  const existingWork = await prisma.work.findUnique({
    where: { id },
    select: { slug: true },
  })
  
  if (!existingWork) {
    throw new Error('作品不存在')
  }
  
  const slug = existingWork.slug

  await prisma.work.update({
    where: { id },
    data: {
      title: payload.title,
      slug,
      date: new Date(payload.date),
      textBody: payload.textBody,
      categoryId: payload.categoryId,
    },
  })

  // 处理图片：删除旧的，创建新的
  await prisma.media.deleteMany({ where: { workId: id } })
  for (const img of payload.images) {
    await prisma.media.create({
      data: {
        workId: id,
        url: img.url,
        sortOrder: img.sortOrder,
      },
    })
  }

  // 处理嵌入代码：删除旧的，创建新的（清理自动播放参数）
  await prisma.embed.deleteMany({ where: { workId: id } })
  for (const emb of payload.embeds) {
    await prisma.embed.create({
      data: {
        workId: id,
        type: emb.type,
        title: emb.title,
        embedCode: sanitizeEmbedCode(emb.embedCode),
        sortOrder: emb.sortOrder,
      },
    })
  }

  revalidatePath('/works')
  revalidatePath(`/works/${slug}`)
  redirect('/admin/works')
}
