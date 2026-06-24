import type { Metadata } from 'next'
import Script from 'next/script'
import './style.css'

export const metadata: Metadata = {
  title: '我的作品',
  description: '个人作品集 · Personal Portfolio',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <style>{`
          * { margin:0; padding:0; box-sizing:border-box; }
          body { font-family:'Noto Sans SC',-apple-system,BlinkMacSystemFont,sans-serif; background:#f7f7f8; color:#1a1a1a; line-height:1.6; font-size:15px; -webkit-font-smoothing:antialiased; }
          a { text-decoration:none; }
        `}</style>
      </head>
      <body>
        <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
        {children}
      </body>
    </html>
  )
}
