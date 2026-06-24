'use client'

import { signOut, useSession } from 'next-auth/react'

export default function LogoutButton() {
  const { data: session } = useSession()

  if (!session) return null

  return (
    <button
      onClick={() => signOut({ callbackUrl: '/admin/login' })}
      className="text-[13px] text-[#aaa] hover:text-[#1a1a1a] transition-colors cursor-pointer bg-transparent border-none font-sans"
    >
      退出登录
    </button>
  )
}
