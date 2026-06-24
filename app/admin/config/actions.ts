'use server'

import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'

export async function updateConfigs(formData: FormData) {
  for (const [key, value] of formData.entries()) {
    if (typeof value === 'string') {
      await prisma.siteConfig.updateMany({
        where: { key },
        data: { value },
      })
    }
  }
  revalidatePath('/')
  revalidatePath('/admin/config')
}

export async function changePassword(formData: FormData) {
  const email = formData.get('email') as string
  const oldPassword = formData.get('oldPassword') as string
  const newPassword = formData.get('newPassword') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!email || !oldPassword || !newPassword) {
    return { error: '请填写所有字段' }
  }
  if (newPassword !== confirmPassword) {
    return { error: '两次新密码不一致' }
  }
  if (newPassword.length < 6) {
    return { error: '新密码长度至少6位' }
  }

  // 查找用户（按邮箱或默认用户）
  const user = await prisma.user.findFirst()
  if (!user) return { error: '用户不存在' }

  // 验证旧密码
  const valid = await bcrypt.compare(oldPassword, user.password)
  if (!valid) return { error: '当前密码错误' }

  // 更新邮箱和密码
  const updates: any = {}
  if (email !== user.email) updates.email = email
  updates.password = await bcrypt.hash(newPassword, 10)

  await prisma.user.update({ where: { id: user.id }, data: updates })

  revalidatePath('/admin/config')
  return { success: '密码修改成功' }
}
