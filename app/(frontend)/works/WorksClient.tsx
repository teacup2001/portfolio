'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import Link from 'next/link'

interface Category {
  id: string
  name: string
  parentId: string | null
  slug: string
  sortOrder: number
  children: {
    id: string
    name: string
    parentId: string | null
    slug: string
    sortOrder: number
  }[]
}

interface Work {
  id: string
  title: string
  slug: string
  date: Date
  category: {
    id: string
    name: string
    parentId: string | null
  }
  medias: {
    id: string
    url: string
    sortOrder: number
  }[]
}

interface WorksClientProps {
  categories: Category[]
  allCategories: {
    id: string
    name: string
    parentId: string | null
  }[]
  initialWorks: Work[]
}

export default function WorksClient({ categories, allCategories, initialWorks }: WorksClientProps) {
  // 状态：只保存当前选中的分类 ID
  const [selectedParentId, setSelectedParentId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      return params.get('category')
    }
    return null
  })
  
  const [selectedChildId, setSelectedChildId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      return params.get('child')
    }
    return null
  })
  
  // 用 ref 保存数据，避免闭包问题
  const categoriesRef = useRef(categories)
  const allCategoriesRef = useRef(allCategories)
  const initialWorksRef = useRef(initialWorks)
  
  // 确保 ref 在数据更新时同步
  useEffect(() => {
    categoriesRef.current = categories
    allCategoriesRef.current = allCategories
    initialWorksRef.current = initialWorks
  }, [categories, allCategories, initialWorks])
  
  // 获取大类
  const parentCategories = categories.filter(c => !c.parentId)
  
  // 当前显示的小类筛选
  const [childFilters, setChildFilters] = useState<{
    id: string
    name: string
    parentId: string | null
    slug: string
    sortOrder: number
  }[]>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const categoryId = params.get('category')
      if (!categoryId) return []
      
      const cat = categories.find(c => c.id === categoryId)
      if (cat && cat.children.length > 0) {
        return cat.children
      } else if (cat?.parentId) {
        const parent = categories.find(c => c.id === cat.parentId)
        return parent ? parent.children : []
      }
    }
    return []
  })
  
  // ===== 核心：用 useMemo 直接计算过滤结果 =====
  const displayWorks = useMemo(() => {
    if (!selectedParentId) return initialWorksRef.current
    
    if (selectedChildId) {
      // 筛选小类
      return initialWorksRef.current.filter(w => w.category.id === selectedChildId)
    } else {
      // 筛选大类（包括其下所有小类）
      const cat = categoriesRef.current.find(c => c.id === selectedParentId)
      if (!cat) return initialWorksRef.current
      
      if (cat.children.length > 0) {
        const childIds = cat.children.map(ch => ch.id)
        return initialWorksRef.current.filter(w => 
          w.category.id === selectedParentId || childIds.includes(w.category.id)
        )
      } else {
        return initialWorksRef.current.filter(w => w.category.id === selectedParentId)
      }
    }
  }, [selectedParentId, selectedChildId])
  
  // ===== 分页逻辑 =====
  const pageSize = 12 // 每页显示 12 个作品
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(displayWorks.length / pageSize)
  const currentPageWorks = displayWorks.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )
  
  // 切换分类时回到第 1 页
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedParentId, selectedChildId])
  
  // 点击大类
  const handleParentClick = useCallback((categoryId: string) => {
    if (selectedParentId === categoryId && !selectedChildId) {
      // 取消选中 → 回到全部
      setSelectedParentId(null)
      setSelectedChildId(null)
      setChildFilters([])
    } else {
      // 选中大类
      setSelectedParentId(categoryId)
      setSelectedChildId(null)
      
      // 更新小类筛选显示
      const cat = categoriesRef.current.find(c => c.id === categoryId)
      if (cat && cat.children.length > 0) {
        setChildFilters(cat.children)
      } else {
        setChildFilters([])
      }
    }
  }, [selectedParentId, selectedChildId])
  
  // 点击小类
  const handleChildClick = useCallback((childId: string) => {
    if (selectedChildId === childId) {
      // 取消选中小类，回到大类筛选
      setSelectedChildId(null)
    } else {
      // 选中小类
      setSelectedChildId(childId)
    }
  }, [selectedChildId])
  
  // 点击"全部"
  const handleAllClick = useCallback(() => {
    setSelectedParentId(null)
    setSelectedChildId(null)
    setChildFilters([])
  }, [])
  
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* 分类标签栏 */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-8 text-[13px]">
        <button
          type="button"
          onClick={handleAllClick}
          className={`shrink-0 px-3 py-1 rounded-full ${
            !selectedParentId ? 'bg-[#2d2d2d] text-white' : 'text-[#888] hover:text-[#1a1a1a]'
          }`}
        >
          全部
        </button>
        {parentCategories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleParentClick(cat.id)}
            className={`shrink-0 px-3 py-1 rounded-full ${
              selectedParentId === cat.id ? 'bg-[#2d2d2d] text-white' : 'text-[#888] hover:text-[#1a1a1a] hover:bg-[#f0f0f0]'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
      
      {/* 小类筛选 */}
      {childFilters.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 text-[12px] text-[#888]">
          <span className="shrink-0 text-[#aaa]">小类：</span>
          {childFilters.map((child) => {
            const isActive = selectedChildId === child.id
            
            return (
              <button
                key={child.id}
                type="button"
                onClick={() => handleChildClick(child.id)}
                className={`shrink-0 px-2 py-0.5 border rounded-full ${
                  isActive
                    ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white'
                    : 'border-[#e5e5e5] text-[#888] hover:border-[#1a1a1a] hover:text-[#1a1a1a]'
                }`}
              >
                {child.name}
              </button>
            )
          })}
        </div>
      )}
      
      {/* 作品网格 */}
      {displayWorks.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-sm text-[#bbb]">暂无作品</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {currentPageWorks.map((work) => (
              <Link
                key={work.id}
                href={`/works/${work.slug}`}
                className="group block bg-white border border-[#eee] rounded-xl overflow-hidden hover:border-[#ddd] no-underline"
              >
                {/* 封面 */}
                <div className="aspect-[4/3] bg-[#f5f5f5] relative">
                  {work.medias.length > 0 ? (
                    <img
                      src={work.medias[0].url}
                      alt={work.title}
                      loading="lazy" // 懒加载
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#ddd] text-xs">
                      暂无封面
                    </div>
                  )}
                </div>
                {/* 信息 */}
                <div className="p-4">
                  <h3 className="font-medium text-[15px] text-[#1a1a1a] truncate group-hover:text-[#555] transition-colors">
                    {work.title}
                  </h3>
                  <div className="mt-2 flex items-center gap-2">
                    {/* 分类信息：大类 — 小类 */}
                    <span className="text-[15px] text-[#555]">
                      {work.category.parentId 
                        ? (() => {
                            const parent = allCategoriesRef.current.find(c => c.id === work.category.parentId)
                            return parent ? (
                              <>
                                <span className="font-medium text-[#333]">{parent.name}</span>
                                <span className="text-[#ccc]"> — </span>
                                <span className="text-[14px] text-[#777]">{work.category.name}</span>
                              </>
                            ) : work.category.name
                          })()
                        : <span className="text-[15px]">{work.category.name}</span>
                      }
                    </span>
                    <span className="text-[#ccc]">·</span>
                    <span className="text-[14px] text-[#888]">
                      {new Date(work.date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {/* 分页控件 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              {/* 上一页 */}
              <button
                type="button"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-[13px] text-[#888] border border-[#e5e5e5] rounded-full hover:border-[#1a1a1a] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ← 上一页
              </button>
              
              {/* 页码 */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 text-[13px] rounded-full transition-colors ${
                    page === currentPage
                      ? 'bg-[#1a1a1a] text-white'
                      : 'text-[#888] hover:text-[#1a1a1a] hover:bg-[#f0f0f0]'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              {/* 下一页 */}
              <button
                type="button"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-[13px] text-[#888] border border-[#e5e5e5] rounded-full hover:border-[#1a1a1a] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                下一页 →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
