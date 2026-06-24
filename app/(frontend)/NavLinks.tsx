'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function NavLinks() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = [
    { href: '/', label: '首页' },
    { href: '/works', label: '作品' },
  ]

  return (
    <>
      {/* 桌面端 */}
      <nav className="hidden md:flex items-center gap-8 text-sm tracking-wide">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="text-[#6b7280] hover:text-[#1a1a1a] transition-colors duration-200"
          >
            {l.label}
          </Link>
        ))}
        <Link
          href="/admin/login"
          className="text-[#9ca3af] hover:text-[#1a1a1a] transition-colors duration-200"
        >
          管理
        </Link>
      </nav>

      {/* 移动端菜单按钮 */}
      <button
        className="md:hidden flex flex-col gap-[5px] p-2"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="菜单"
      >
        <span className={`w-5 h-[1.5px] bg-[#1a1a1a] transition-all ${mobileOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
        <span className={`w-5 h-[1.5px] bg-[#1a1a1a] transition-all ${mobileOpen ? 'opacity-0' : ''}`} />
        <span className={`w-5 h-[1.5px] bg-[#1a1a1a] transition-all ${mobileOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
      </button>

      {/* 移动端菜单 */}
      {mobileOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-[#fafafa]/95 backdrop-blur-md border-b border-[#e5e5e5]">
          <nav className="flex flex-col px-8 py-6 gap-4 text-sm tracking-wide">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[#6b7280] hover:text-[#1a1a1a] py-1"
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/admin/login"
              className="text-[#9ca3af] hover:text-[#1a1a1a] py-1"
              onClick={() => setMobileOpen(false)}
            >
              管理
            </Link>
          </nav>
        </div>
      )}
    </>
  )
}
