'use client'

import { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/admin')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f7f8]">
        <p className="text-[13px] text-[#bbb]">加载中...</p>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (res?.error) {
      setError('邮箱或密码错误')
    } else {
      router.push('/admin')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f7f8] px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-xl font-medium text-[#1a1a1a]">管理员登录</h1>
          <p className="mt-2 text-[13px] text-[#bbb]">登录后管理作品和配置</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              name="email"
              type="email"
              required
              placeholder="邮箱"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-sm bg-white border border-[#eee] rounded-lg text-[#1a1a1a] placeholder-[#ccc] focus:outline-none focus:border-[#bbb] transition-colors"
            />
          </div>
          <div>
            <input
              name="password"
              type="password"
              required
              placeholder="密码"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-sm bg-white border border-[#eee] rounded-lg text-[#1a1a1a] placeholder-[#ccc] focus:outline-none focus:border-[#bbb] transition-colors"
            />
          </div>
          {error && (
            <p className="text-[13px] text-red-500">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-sm font-medium bg-[#2d2d2d] text-white rounded-lg hover:bg-[#1a1a1a] transition-colors disabled:opacity-50"
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>
      </div>
    </div>
  )
}
