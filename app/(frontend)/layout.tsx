import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 获取网站配置
  const configs = await prisma.siteConfig.findMany()
  const config: Record<string, string> = {}
  configs.forEach(c => { config[c.key] = c.value })
  const footerTitle = config['footer_title'] || '联系我'
  const footerContent = config['footer_content'] || '联系方式，各平台账号，作品版权说明'
  const siteLogoText = config['site_logo_text'] || '我的作品'

  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      {/* 顶部导航栏 - 只包含 Logo 和管理入口 */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-[#eee]">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* 左侧 Logo */}
          <Link href="/" className="flex items-center gap-2 text-base font-medium text-[#1a1a1a] no-underline hover:opacity-70 transition-opacity">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19l7-7 3 3-7 7-3-3z"/>
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
              <path d="M2 2l7.586 7.586"/>
              <circle cx="11" cy="11" r="2"/>
            </svg>
            {siteLogoText}
          </Link>

          {/* 右侧管理入口 */}
          <div className="flex items-center gap-4">
            <Link
              href="/admin/login"
              className="flex items-center gap-1.5 text-[13px] text-[#aaa] hover:text-[#1a1a1a] transition-colors no-underline"
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

      {/* 主内容 */}
      <main>{children}</main>

      {/* 底部联系区 */}
      <footer className="mt-28 pb-10">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h3 className="text-lg font-semibold text-[#1a1a1a] tracking-wide uppercase mb-3">
            {footerTitle}
          </h3>
          <div className="text-[15px] text-[#555] whitespace-pre-wrap leading-relaxed" dangerouslySetInnerHTML={{ __html: footerContent }} />
          <div className="mt-6 w-32 mx-auto h-[2px] bg-[#1a1a1a] rounded-full" />
        </div>
      </footer>
    </div>
  )
}
