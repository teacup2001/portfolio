'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: '仪表盘', href: '/admin' },
  { label: '作品管理', href: '/admin/works' },
  { label: '分类管理', href: '/admin/categories' },
  { label: '网站配置', href: '/admin/config' },
]

export default function AdminNav() {
  const pathname = usePathname()
  
  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-8 text-[13px]">
      {navItems.map((item) => {
        const isActive = pathname === item.href || 
          (item.href !== '/admin' && pathname.startsWith(item.href))
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`shrink-0 px-3 py-1 rounded-full transition-colors no-underline ${
              isActive 
                ? 'bg-[#2d2d2d] text-white' 
                : 'text-[#888] hover:text-[#1a1a1a] hover:bg-[#f0f0f0]'
            }`}
          >
            {item.label}
          </Link>
        )
      })}
    </div>
  )
}
