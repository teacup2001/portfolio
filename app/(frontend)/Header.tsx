'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

interface HeaderProps {
  categories: { id: string; name: string }[]
  siteLogoText: string
  footerTitle: string
  footerContent: string
}

export default function Header({ categories, siteLogoText, footerTitle, footerContent }: HeaderProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  
  // 监听 URL 变化，更新选中状态
  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search)
      const categoryId = params.get('category')
      setSelectedCategory(categoryId)
    }
    
    // 初始检查
    handleUrlChange()
    
    // 监听 popstate（浏览器前进后退）
    window.addEventListener('popstate', handleUrlChange)
    return () => window.removeEventListener('popstate', handleUrlChange)
  }, [])
  
  // 点击分类
  const handleCategoryClick = (categoryId: string) => {
    // 更新 URL（不刷新页面）
    const newUrl = `/works?category=${categoryId}`
    window.history.pushState({}, '', newUrl)
    
    // 更新选中状态
    setSelectedCategory(categoryId)
    
    // 触发自定义事件，通知 WorksClient 组件更新
    window.dispatchEvent(new CustomEvent('categoryChange', { 
      detail: { categoryId, childId: null } 
    }))
  }
  
  const navItems = categories.map((c) => ({
    label: c.name,
    href: `/works?category=${c.id}`,
    id: c.id,
  }))
  
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-[#eee]">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* 左侧 Logo */}
        <Link href="/" className="flex items-center gap-2 text-base font-medium text-[#1a1a1a] no-underline hover:opacity-70 transition-opacity shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19l7-7 3 3-7 7-3-3z"/>
            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
            <path d="M2 2l7.586 7.586"/>
            <circle cx="11" cy="11" r="2"/>
          </svg>
          {siteLogoText}
        </Link>
        
        {/* 中间分类标签 */}
        <nav className="hidden md:flex items-center gap-6 text-[13px] text-[#888] overflow-x-auto">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleCategoryClick(item.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap no-underline transition-colors ${
                selectedCategory === item.id
                  ? 'text-[#1a1a1a] font-medium'
                  : 'text-[#888] hover:text-[#1a1a1a]'
              }`}
            >
              {item.label}
            </button>
          ))}
          <span className="text-[#ddd]">···</span>
          <Link href="/works" className="whitespace-nowrap no-underline text-[#888] hover:text-[#1a1a1a] transition-colors">
            其他
          </Link>
        </nav>
        
        {/* 右侧 */}
        <div className="flex items-center gap-4 shrink-0">
          <Link
            href="/admin/login"
            className="hidden sm:flex items-center gap-1.5 text-[13px] text-[#aaa] hover:text-[#1a1a1a] transition-colors no-underline"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2">
              <circle cx="8" cy="7" r="3"/>
              <path d="M2 14c0-2.5 2.7-4.5 6-4.5S14 11.5 14 14"/>
            </svg>
            设置管理
          </Link>
        </div>
      </div>
    </header>
  )
}
