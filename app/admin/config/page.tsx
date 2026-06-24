import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { changePassword } from './actions'
import PasswordForm from './PasswordForm'

export default async function ConfigPage() {
  const [configs, adminUser] = await Promise.all([
    prisma.siteConfig.findMany({ orderBy: { group: 'asc' } }),
    prisma.user.findFirst({ select: { email: true } }),
  ])

  // 按分组整理，过滤掉无用的组
  const IGNORE_GROUPS = new Set(['home', 'nav', 'work', 'about'])
  const IGNORE_KEYS = new Set(['footer_copyright', 'footer_contact'])

  const groups = configs.reduce((acc: Record<string, typeof configs>, c) => {
    if (IGNORE_GROUPS.has(c.group)) return acc
    if (IGNORE_KEYS.has(c.key)) return acc
    ;(acc[c.group] ||= []).push(c)
    return acc
  }, {})

  const groupLabels: Record<string, string> = {
    general: '通用',
    nav: '导航栏',
    home: '首页',
    works: '作品页',
    about: '关于页',
    footer: '页脚',
  }

  return (
    <div className="fade-in max-w-2xl">
      <h1 className="font-serif text-2xl font-semibold text-[#1a1a1a] mb-8">
        网站配置
      </h1>

      {/* ═ 账号设置 */}
      <section className="mb-12">
        <h2 className="font-serif text-sm font-semibold text-[#1a1a1a] tracking-wide uppercase border-b border-[#e5e5e5] pb-2 mb-4">
          账号设置
        </h2>
        <PasswordForm currentEmail={adminUser?.email || ''} />
      </section>

      {/* ║ 网站文本配置 */}
      {Object.entries(groups).map(([group, items]) => (
        <section key={group} className="mb-10">
          <h2 className="font-serif text-sm font-semibold text-[#1a1a1a] tracking-wide uppercase border-b border-[#e5e5e5] pb-2 mb-4">
            {groupLabels[group] || group}
          </h2>
          <form
            action={async (formData: FormData) => {
              'use server'
              for (const [key, value] of formData.entries()) {
                await prisma.siteConfig.updateMany({
                  where: { key },
                  data: { value: String(value) },
                })
              }
              revalidatePath('/')
              revalidatePath('/admin/config')
              redirect('/admin/config')
            }}
            className="space-y-4"
          >
            {(items as any[]).map((c) => (
              <div key={c.key}>
                <label className="block text-xs text-[#9ca3af] mb-1.5 tracking-wide">
                  {c.label}
                </label>
                {c.key === 'footer_content' || c.value.length > 60 ? (
                  <textarea
                    name={c.key}
                    defaultValue={c.value}
                    rows={4}
                    className="w-full px-3 py-2 text-sm border border-[#e5e5e5] bg-white text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] transition-colors resize-none font-sans"
                  />
                ) : (
                  <input
                    name={c.key}
                    defaultValue={c.value}
                    className="w-full px-3 py-2 text-sm border border-[#e5e5e5] bg-white text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] transition-colors font-sans"
                  />
                )}
              </div>
            ))}

            <button
              type="submit"
              className="text-sm px-6 py-2.5 bg-[#1a1a1a] text-white hover:bg-[#333] transition-colors tracking-wide"
            >
              保存更改
            </button>
          </form>
        </section>
      ))}
    </div>
  )
}
