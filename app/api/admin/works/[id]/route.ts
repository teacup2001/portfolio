import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('删除作品 ID：', id)
    await prisma.work.delete({
      where: { id },
    })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('删除作品失败：', error)
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: '作品不存在' }, { status: 404 })
    }
    return NextResponse.json({ error: error?.message || '删除失败' }, { status: 500 })
  }
}
