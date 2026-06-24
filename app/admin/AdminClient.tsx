'use client'

import { useState, useCallback, Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

// 各个管理页面
import Works from './WorksClient'
import Categories from './CategoriesClient'
import Config from './ConfigClient'

type AdminTab = 'works' | 'categories' | 'config'

export default function AdminClient() {
  const [activeTab, setActiveTab] = useState<AdminTab>('works')
  const searchParams = useSearchParams()
  
  // 从 URL 参数初始化 tab
  useEffect(() => {
    const tab = searchParams.get('tab') as AdminTab | null
    if (tab && ['works', 'categories', 'config'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])
  
  // 切换 tab（使用 useCallback 避免不必要的重新渲染）
  const handleTabChange = useCallback((tab: AdminTab) => {
    setActiveTab(tab)
  }, [])
  
  // 根据当前 tab 渲染对应内容
  const renderContent = () => {
    switch (activeTab) {
      case 'works':
        return <Works />
      case 'categories':
        return <Categories />
      case 'config':
        return <Config />
      default:
        return <Works />
    }
  }
  
  // 导航按钮数据（移除仪表盘）
  const navItems: { label: string; tab: AdminTab }[] = [
    { label: '作品管理', tab: 'works' },
    { label: '分类管理', tab: 'categories' },
    { label: '网站配置', tab: 'config' },
  ]
  
  return (
    <div>
      {/* 上方导航按钮 - 使用按钮切换，不刷新页面 */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-8 text-[13px]">
        {navItems.map((item) => (
          <button
            key={item.tab}
            onClick={() => handleTabChange(item.tab)}
            className={`shrink-0 px-3 py-1 rounded-full transition-colors ${
              activeTab === item.tab 
                ? 'bg-[#2d2d2d] text-white' 
                : 'text-[#888] hover:text-[#1a1a1a] hover:bg-[#f0f0f0]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      
      {/* 内容区域 */}
      <Suspense fallback={<div className="text-center py-24 text-sm text-[#bbb]">加载中...</div>}>
        {renderContent()}
      </Suspense>
    </div>
  )
}
