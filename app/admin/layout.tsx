import Link from 'next/link'
import Providers from '@/app/providers'
import LogoutButton from './LogoutButton'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <div className="min-h-screen bg-[#f7f7f8]">
        {/* 顶部栏 - 只保留标题和退出登录 */}
        <header className="sticky top-0 z-50 bg-white border-b border-[#eee]">
          <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
            <span className="text-base font-medium text-[#1a1a1a]">
              管理后台
            </span>
            <div className="flex items-center gap-6">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-[#888] hover:text-[#1a1a1a] transition-colors no-underline"
              >
                查看网站 ↗
              </a>
              <LogoutButton />
            </div>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-6 py-8">
          {/* 页面内容 */}
          {children}
        </div>
      </div>
    </Providers>
  )
}
