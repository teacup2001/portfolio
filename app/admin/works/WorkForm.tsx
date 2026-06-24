'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createWork, updateWork } from './actions'

interface MediaItem {
  id?: string
  url: string
  sortOrder: number
}

interface EmbedItem {
  id?: string
  type: 'VIDEO' | 'AUDIO'
  title: string
  embedCode: string
  sortOrder: number
}

interface WorkFormProps {
  mode: 'new' | 'edit'
  workId?: string
  defaultTitle?: string
  defaultCategoryId?: string
  defaultDate?: string
  defaultTextBody?: string
  defaultMedias?: MediaItem[]
  defaultEmbeds?: EmbedItem[]
  categories: { id: string; name: string; parentId: string | null; children?: { id: string; name: string }[] }[]
}

export default function WorkForm({
  mode,
  workId,
  defaultTitle = '',
  defaultCategoryId = '',
  defaultDate = '',
  defaultTextBody = '',
  defaultMedias = [],
  defaultEmbeds = [],
  categories,
}: WorkFormProps) {
  const router = useRouter()

  const [title, setTitle] = useState(defaultTitle)
  const [categoryId, setCategoryId] = useState(defaultCategoryId)
  const [date, setDate] = useState(defaultDate || new Date().toISOString().split('T')[0])
  const [textBody, setTextBody] = useState(defaultTextBody || '')

  const [images, setImages] = useState<MediaItem[]>(defaultMedias)
  const [uploading, setUploading] = useState(false)

  // embeds 用统一数组，直接按 sortOrder 渲染
  const [embeds, setEmbeds] = useState<EmbedItem[]>(defaultEmbeds)

  const parentCategories = categories.filter(c => !c.parentId)
  const [selectedParentId, setSelectedParentId] = useState<string>(() => {
    if (defaultCategoryId) {
      const cat = categories.find(c => c.id === defaultCategoryId)
      return cat?.parentId || cat?.id || ''
    }
    return ''
  })
  const childCategories = parentCategories.find(c => c.id === selectedParentId)?.children || []
  const showChildSelect = childCategories.length > 0

  useEffect(() => {
    if (defaultCategoryId) {
      const cat = categories.find(c => c.id === defaultCategoryId)
      setSelectedParentId(cat?.parentId || cat?.id || '')
      if (!cat?.parentId) {
        setCategoryId(cat?.id || '')
      }
    }
  }, [])

  // ── 图片上传 ──────────────────────────────
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.url) {
        setImages(prev => [...prev, { url: data.url, sortOrder: prev.length }])
      }
    } catch {
      alert('上传失败')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  function moveImageUp(i: number) {
    if (i === 0) return
    setImages(prev => {
      const next = [...prev]
      ;[next[i - 1], next[i]] = [next[i], next[i - 1]]
      return next.map((item, idx) => ({ ...item, sortOrder: idx }))
    })
  }
  function moveImageDown(i: number) {
    if (i === images.length - 1) return
    setImages(prev => {
      const next = [...prev]
      ;[next[i], next[i + 1]] = [next[i + 1], next[i]]
      return next.map((item, idx) => ({ ...item, sortOrder: idx }))
    })
  }
  function removeImage(i: number) {
    setImages(prev => prev.filter((_, idx) => idx !== i).map((item, idx) => ({ ...item, sortOrder: idx })))
  }

  // ── 嵌入 ──────────────────────────────────
  function addEmbed(type: 'VIDEO' | 'AUDIO') {
    setEmbeds(prev => [...prev, { type, title: '', embedCode: '', sortOrder: prev.length }])
  }

  function updateEmbed(i: number, field: string, value: string) {
    setEmbeds(prev => prev.map((item, idx) => idx === i ? { ...item, [field]: value } : item))
  }

  function moveEmbedUp(i: number) {
    if (i === 0) return
    setEmbeds(prev => {
      const next = [...prev]
      ;[next[i - 1], next[i]] = [next[i], next[i - 1]]
      return next.map((item, idx) => ({ ...item, sortOrder: idx }))
    })
  }
  function moveEmbedDown(i: number) {
    if (i === embeds.length - 1) return
    setEmbeds(prev => {
      const next = [...prev]
      ;[next[i], next[i + 1]] = [next[i + 1], next[i]]
      return next.map((item, idx) => ({ ...item, sortOrder: idx }))
    })
  }
  function removeEmbed(i: number) {
    setEmbeds(prev => prev.filter((_, idx) => idx !== i).map((item, idx) => ({ ...item, sortOrder: idx })))
  }

  // ── 提交 ──────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) { alert('请填写标题'); return }
    if (!categoryId) { alert('请选择分类'); return }

    const payload = {
      title: title.trim(),
      categoryId,
      date,
      textBody: textBody.trim() || null,
      images: images.map((img, i) => ({ id: img.id, url: img.url, sortOrder: i })),
      embeds: embeds.map((emb, i) => ({ id: emb.id, type: emb.type, title: emb.title || null, embedCode: emb.embedCode, sortOrder: i })),
    }

    try {
      if (mode === 'new') {
        await createWork(payload)
      } else {
        await updateWork(workId!, payload)
      }
      router.push('/admin/works')
    } catch (err: any) {
      alert(err.message || '保存失败')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 标题 */}
      <div>
        <label className="block text-xs text-[#9ca3af] mb-1.5 tracking-wide">标题 *</label>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          className="w-full px-3 py-2.5 text-sm border border-[#e5e5e5] bg-white text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] transition-colors"
        />
      </div>

      {/* 分类（两级）*/}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-[#9ca3af] mb-1.5 tracking-wide">大类 *</label>
          <select
            value={selectedParentId}
            onChange={e => {
              setSelectedParentId(e.target.value)
              if (!showChildSelect) setCategoryId(e.target.value)
              else setCategoryId('')
            }}
            required
            className="w-full px-3 py-2.5 text-sm border border-[#e5e5e5] bg-white text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] transition-colors"
          >
            <option value="">请选择大类</option>
            {parentCategories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        {showChildSelect && (
          <div>
            <label className="block text-xs text-[#9ca3af] mb-1.5 tracking-wide">小类 *</label>
            <select
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              required
              className="w-full px-3 py-2.5 text-sm border border-[#e5e5e5] bg-white text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] transition-colors"
            >
              <option value="">请选择小类</option>
              {childCategories.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* 日期 */}
      <div>
        <label className="block text-xs text-[#9ca3af] mb-1.5 tracking-wide">发布日期</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full px-3 py-2.5 text-sm border border-[#e5e5e5] bg-white text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] transition-colors"
        />
      </div>

      {/* 多图 */}
      <div>
        <label className="block text-xs text-[#9ca3af] mb-1.5 tracking-wide">多图（第一张为预览图）</label>
        <div className="space-y-3">
          {images.map((img, i) => (
            <div key={i} className="flex items-center gap-3 bg-[#fafafa] border border-[#eee] p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" className="w-16 h-16 object-cover border border-[#eee]" />
              <span className="text-[12px] text-[#999] shrink-0">#{i + 1}</span>
              <div className="flex gap-1 shrink-0">
                <button type="button" onClick={() => moveImageUp(i)} disabled={i === 0} className="px-2 py-1 text-[11px] border border-[#ddd] bg-white hover:bg-[#f5f5f5] disabled:opacity-30">↑</button>
                <button type="button" onClick={() => moveImageDown(i)} disabled={i === images.length - 1} className="px-2 py-1 text-[11px] border border-[#ddd] bg-white hover:bg-[#f5f5f5] disabled:opacity-30">↓</button>
              </div>
              <button type="button" onClick={() => removeImage(i)} className="px-2 py-1 text-[11px] text-red-500 border border-red-200 bg-white hover:bg-red-50">删除</button>
            </div>
          ))}
          <label className="inline-block text-sm px-4 py-2 border border-[#ddd] bg-white text-[#888] hover:bg-[#f5f5f5] cursor-pointer transition-colors">
            {uploading ? '上传中...' : '+ 上传图片'}
            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
          </label>
        </div>
      </div>

      {/* 嵌入列表（视频 + 音频合并显示）*/}
      {embeds.length > 0 && (
        <div>
          <label className="block text-xs text-[#9ca3af] mb-1.5 tracking-wide">嵌入列表（视频 / 音频）</label>
          <div className="space-y-3">
            {embeds.map((emb, i) => (
              <div key={i} className="bg-[#fafafa] border border-[#eee] p-3 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-[12px] text-[#999] shrink-0">
                    {emb.type === 'VIDEO' ? '🎬 视频' : '🎵 音频'} #{i + 1}
                  </span>
                  <div className="flex gap-1 shrink-0">
                    <button type="button" onClick={() => moveEmbedUp(i)} disabled={i === 0} className="px-2 py-1 text-[11px] border border-[#ddd] bg-white hover:bg-[#f5f5f5] disabled:opacity-30">↑</button>
                    <button type="button" onClick={() => moveEmbedDown(i)} disabled={i === embeds.length - 1} className="px-2 py-1 text-[11px] border border-[#ddd] bg-white hover:bg-[#f5f5f5] disabled:opacity-30">↓</button>
                  </div>
                  <button type="button" onClick={() => removeEmbed(i)} className="px-2 py-1 text-[11px] text-red-500 border border-red-200 bg-white hover:bg-red-50">删除</button>
                </div>
                <input
                  value={emb.title || ''}
                  onChange={e => updateEmbed(i, 'title', e.target.value)}
                  placeholder="标题（可选）"
                  className="w-full px-3 py-2 text-sm border border-[#e5e5e5] bg-white text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] transition-colors"
                />
                <textarea
                  value={emb.embedCode}
                  onChange={e => updateEmbed(i, 'embedCode', e.target.value)}
                  placeholder='粘贴嵌入代码（如 <iframe src="..."></iframe>）'
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-[#e5e5e5] bg-white text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] transition-colors resize-none font-mono text-[12px]"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 添加视频 / 音频按钮 */}
      <div className="flex gap-3">
        <button type="button" onClick={() => addEmbed('VIDEO')} className="inline-block text-sm px-4 py-2 border border-[#ddd] bg-white text-[#888] hover:bg-[#f5f5f5] transition-colors">
          + 添加视频
        </button>
        <button type="button" onClick={() => addEmbed('AUDIO')} className="inline-block text-sm px-4 py-2 border border-[#ddd] bg-white text-[#888] hover:bg-[#f5f5f5] transition-colors">
          + 添加音频
        </button>
      </div>

      {/* 文本正文 */}
      <div>
        <label className="block text-xs text-[#9ca3af] mb-1.5 tracking-wide">文本正文（纯文本）</label>
        <textarea
          value={textBody}
          onChange={e => setTextBody(e.target.value)}
          rows={8}
          placeholder="作品正文内容..."
          className="w-full px-3 py-2.5 text-sm border border-[#e5e5e5] bg-white text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] transition-colors resize-none"
        />
      </div>

      {/* 按钮 */}
      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          className="text-sm px-6 py-2.5 bg-[#1a1a1a] text-white hover:bg-[#333] transition-colors tracking-wide"
        >
          {mode === 'new' ? '创建' : '保存'}
        </button>
        <Link
          href="/admin/works"
          className="text-sm text-[#9ca3af] hover:text-[#1a1a1a] transition-colors"
        >
          取消
        </Link>
      </div>
    </form>
  )
}
