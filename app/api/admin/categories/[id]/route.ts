import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('删除分类 ID：', id)
    await prisma.category.delete({
      where: { id },
    })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('删除分类失败：', error)
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: '分类不存在' }, { status: 404 })
    }
    if (error?.code === 'P2003') {
      return NextResponse.json({ error: '该分类下还有作品，无法删除' }, { status: 400 })
    }
    return NextResponse.json({ error: error?.message || '删除失败' }, { status: 500 })
  }
}
