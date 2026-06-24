import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function HomePage() {
  // 获取所有大类（包含其下的小类）
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { sortOrder: 'asc' },
    include: {
      children: {
        orderBy: { sortOrder: 'asc' }
      }
    }
  })

  // 获取网站配置
  const configs = await prisma.siteConfig.findMany()
  const config: Record<string, string> = {}
  configs.forEach(c => { config[c.key] = c.value })

  // 配置默认值
  const siteTitle = config['site_title'] || '我的作品'
  const siteSubtitle = config['site_subtitle'] || 'Personal Portfolio'
  const siteDescription = config['site_description'] || '欢迎来到我的个人作品集，这里收录了我的各类创作作品。'
  const heroButtonText = config['hero_button_text'] || '浏览作品'
  const footerContent = config['footer_content'] || '联系方式，各平台账号，作品版权说明'

  return (
    <div>
      {/* Hero 区域 */}
      <section className="py-20 md:py-28 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1a1a1a]">
          {siteTitle}
        </h1>
        <p className="mt-3 text-[15px] text-[#aaa] tracking-wide">
          {siteSubtitle}
        </p>
        <p className="mt-4 text-sm text-[#bbb] max-w-md mx-auto leading-relaxed">
          {siteDescription}
        </p>
        <Link
          href="/works"
          className="mt-8 inline-flex items-center gap-2 px-6 py-2.5 bg-[#2d2d2d] text-white text-[13px] rounded-full hover:bg-[#1a1a1a] transition-colors no-underline"
        >
          {heroButtonText}
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </section>

      {/* 作品分类 */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-center font-medium text-lg text-[#1a1a1a] mb-8">
          作品分类
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* 空状态：无分类时显示默认卡片 */}
      {categories.length === 0 && (
        <section className="max-w-5xl mx-auto px-6 pb-16">
          <h2 className="text-center font-medium text-lg text-[#1a1a1a] mb-8">
            作品分类
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <DefaultCard
              icon={<PaletteIcon />}
              title="绘画"
              desc="用画笔捕捉灵感，每一幅作品都是一个独特的世界。"
            />
            <DefaultCard
              icon={<FilmIcon />}
              title="动画"
              desc="让画面动起来，讲述视觉故事的无限可能。"
            />
            <DefaultCard
              icon={<CubeIcon />}
              title="3D建模"
              desc="在三维空间中构建想象，细节与真实的完美结合。"
            />
            <DefaultCard
              icon={<GameIcon />}
              title="独立游戏"
              desc="独立游戏开发，融合创意与技术的互动体验。"
            />
            <DefaultCard
              icon={<MoreIcon />}
              title="其他"
              desc="小说、插件、小程序……创意不止一种形式。"
            />
          </div>
        </section>
      )}
    </div>
  )
}

/* ─── 分类卡片（数据库）─── */
function CategoryCard({ category }: { category: any }) {
  const icon = getCategoryIcon(category.name)
  const childNames = category.children?.map((child: any) => child.name).join('、') || '暂无小类'
  
  return (
    <Link
      href={`/works?category=${category.id}`}
      className="group block bg-white border border-[#eee] rounded-2xl p-8 text-center hover:border-[#ddd] transition-colors no-underline"
    >
      <div className="w-14 h-14 mx-auto mb-5 flex items-center justify-center bg-[#f5f5f5] rounded-xl text-[#888] group-hover:bg-[#efefef] transition-colors">
        {icon}
      </div>
      <h3 className="font-medium text-base text-[#1a1a1a]">{category.name}</h3>
      <p className="mt-2 text-[13px] text-[#bbb] leading-relaxed">
        {childNames}
      </p>
    </Link>
  )
}

/* ─── 默认卡片（占位）─── */
function DefaultCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-white border border-[#eee] rounded-2xl p-8 text-center">
      <div className="w-14 h-14 mx-auto mb-5 flex items-center justify-center bg-[#f5f5f5] rounded-xl text-[#888]">
        {icon}
      </div>
      <h3 className="font-medium text-base text-[#1a1a1a]">{title}</h3>
      <p className="mt-2 text-[13px] text-[#bbb] leading-relaxed max-w-[200px] mx-auto">
        {desc}
      </p>
    </div>
  )
}

/* ─── 图标组件 ─── */
function PaletteIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/>
    </svg>
  )
}
function FilmIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
      <line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/>
      <line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/>
      <line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/>
    </svg>
  )
}
function CubeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  )
}
function GameIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/>
      <line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/>
      <rect x="2" y="6" width="20" height="12" rx="2"/>
    </svg>
  )
}
function MoreIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
    </svg>
  )
}

/* 分类名称 → 图标映射 */
function getCategoryIcon(name: string): React.ReactNode {
  const map: Record<string, React.ReactNode> = {
    '绘画': <PaletteIcon />,
    '动画': <FilmIcon />,
    '3D建模': <CubeIcon />,
    '建模': <CubeIcon />,
    '游戏': <GameIcon />,
    '独立游戏': <GameIcon />,
  }
  return map[name] || <MoreIcon />
}
