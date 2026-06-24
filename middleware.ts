import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 如果访问 /admin/works、/admin/categories、/admin/config 等旧 URL
  // 重定向到 /admin，并带上 tab 参数
  if (pathname === '/admin/works') {
    return NextResponse.redirect(new URL('/admin?tab=works', request.url))
  }
  if (pathname === '/admin/categories') {
    return NextResponse.redirect(new URL('/admin?tab=categories', request.url))
  }
  if (pathname === '/admin/config') {
    return NextResponse.redirect(new URL('/admin?tab=config', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/works', '/admin/categories', '/admin/config'],
}
