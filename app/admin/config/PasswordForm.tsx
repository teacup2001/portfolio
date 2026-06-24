'use client'

import { useActionState, useEffect } from 'react'
import { changePassword } from './actions'
import { useRouter } from 'next/navigation'

export default function PasswordForm({ currentEmail }: { currentEmail: string }) {
  const [state, formAction, pending] = useActionState(
    async (_prev: any, formDa: FormData) => {
      return changePassword(formDa)
    },
    null
  )

  const router = useRouter()
  useEffect(() => {
    if (state?.success) {
      alert(state.success)
      router.refresh()
    }
  }, [state, router])

  return (
    <form action={formAction} className="space-y-4 max-w-sm">
      <p className="text-[13px] text-[#9ca3af] leading-relaxed">
        修改登录邮箱和/或密码。需要输入当前密码验证身份。
      </p>

      <div>
        <label className="block text-xs text-[#9ca3af] mb-1.5 tracking-wide">
          新邮箱（留空则不修改）
        </label>
        <input
          name="email"
          type="email"
          defaultValue={currentEmail}
          className="w-full px-3 py-2.5 text-sm border border-[#e5e5e5] bg-white text-[#1a1a1a] focus:out-line-none focus:border-[#1a1a1a] transition-colors font-sans"
        />
      </div>

      <div>
        <label className="block text-xs text-[#9ca3af] mb-1.5 tracking-wide">
          当前密码（必填）
        </label>
        <input
          name="oldPassword"
          type="password"
          required
          placeholder="输入当前密码"
          className="w-full px-3 py-2.5 text-sm border border-[#e5e5e5] bg-white text-[#1a1a1a] placeholder-[#ccc] focus:out-line-none focus:border-[#1a1a1a] transition-colors font-sans"
        />
      </div>

      <div>
        <label className="block text-xs text-[#9ca3af] mb-1.5 tracking-wide">
          新密码（留空则不修改）
        </label>
        <input
          name="newPassword"
          type="password"
          placeholder="至少6位"
          className="w-full px-3 py-2.5 text-sm border border-[#e5e5e5] bg-white text-[#1a1a1a] placeholder-[#ccc] focus:out-line-none focus:border-[#1a1a1a] transition-colors font-sans"
        />
      </div>

      <div>
        <label className="block text-xs text-[#9ca3af] mb-1.5 tracking-wide">
          确认新密码
        </label>
        <input
          name="confirmPassword"
          type="password"
          placeholder="再次输入新密码"
          className="w-full px-3 py-2.5 text-sm border border-[#e5e5e5] bg-white text-[#1a1a1a] placeholder-[#ccc] focus:out-line-none focus:border-[#1a1a1a] transition-colors font-sans"
        />
      </div>

      {state?.error && (
        <p className="text-[13px] text-red-500">{state.error}</p>
      )}
      {state?.success && (
        <p className="text-[13px] text-green-600">{state.success}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="text-sm px-6 py-2.5 bg-[#1a1a1a] text-white hover:bg-[#333] transition-colors tracking-wide disabled:opacity-50"
      >
        {pending ? '保存中...' : '保存修改'}
      </button>
    </form>
  )
}
