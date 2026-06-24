import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('表单删除作品 ID：', id)
    
    await prisma.work.delete({
      where: { id },
    })
    
    console.log('删除成功')
    return NextResponse.redirect(new URL('/admin?tab=works&deleted=true', request.url))
  } catch (error: any) {
    console.error('删除失败：', error)
    return NextResponse.json({ error: error?.message || '删除失败' }, { status: 500 })
  }
}
