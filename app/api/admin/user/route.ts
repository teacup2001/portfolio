import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取当前用户（简化版，实际应从 session 获取）
export async function GET() {
  try {
    // 获取第一个用户（管理员）
    const user = await prisma.user.findFirst()
    
    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }
    
    return NextResponse.json({ email: user.email })
  } catch (error) {
    console.error('获取用户失败：', error)
    return NextResponse.json({ error: '获取失败' }, { status: 500 })
  }
}
