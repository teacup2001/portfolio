import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { newPassword } = body
    
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: '密码长度至少6位' }, { status: 400 })
    }
    
    // 加密新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    
    // 更新第一个用户（管理员）的密码
    const user = await prisma.user.findFirst()
    
    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }
    
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('修改密码失败：', error)
    return NextResponse.json({ error: '修改失败' }, { status: 500 })
  }
}
