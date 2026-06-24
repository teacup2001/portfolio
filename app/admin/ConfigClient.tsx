'use client'

import { useState, useEffect, useCallback } from 'react'

interface ConfigGroup {
  [key: string]: {
    id: string
    key: string
    value: string
    label: string
    group: string
  }[]
}

export default function Config() {
  const [groups, setGroups] = useState<ConfigGroup>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const loadConfig = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/config')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setGroups(data)
      
      // 获取当前邮箱
      const userRes = await fetch('/api/admin/user')
      if (!userRes.ok) throw new Error(`HTTP ${userRes.status}`)
      const userData = await userRes.json()
      setEmail(userData.email || '')
    } catch (error: any) {
      console.error('加载配置失败：', error)
      alert('加载配置失败：' + error.message)
    } finally {
      setLoading(false)
    }
  }, [])
  
  useEffect(() => {
    loadConfig()
  }, [loadConfig])
  
  const handleSave = async (groupKey: string, items: any[]) => {
    setSaving(true)
    try {
      const data: Record<string, string> = {}
      items.forEach(item => {
        const input = document.querySelector(`input[name="${item.key}"], textarea[name="${item.key}"]`) as HTMLInputElement | HTMLTextAreaElement
        if (input) {
          data[item.key] = input.value
        }
      })
      
      const res = await fetch('/api/admin/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      if (res.ok) {
        alert('保存成功')
        // 刷新页面以更新显示
        window.location.reload()
      } else {
        alert('保存失败')
      }
    } catch (error) {
      console.error('保存失败：', error)
      alert('保存失败')
    } finally {
      setSaving(false)
    }
  }
  
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      alert('两次输入的密码不一致')
      return
    }
    
    if (newPassword.length < 6) {
      alert('密码长度至少6位')
      return
    }
    
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      })
      
      if (res.ok) {
        alert('密码修改成功')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        alert('密码修改失败')
      }
    } catch (error) {
      console.error('密码修改失败：', error)
      alert('密码修改失败')
    }
  }
  
  if (loading) {
    return <div className="text-center py-24 text-sm text-[#bbb]">加载中...</div>
  }
  
  const groupLabels: Record<string, string> = {
    general: '通用',
    footer: '页脚',
  }
  
  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-2xl font-semibold text-[#1a1a1a] mb-8">网站配置</h1>
      
      {/* 账号设置 */}
      <section className="mb-12">
        <h2 className="font-serif text-sm font-semibold text-[#1a1a1a] tracking-wide uppercase border-b border-[#e5e5e5] pb-2 mb-4">
          账号设置
        </h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-xs text-[#9ca3af] mb-1.5 tracking-wide">当前邮箱</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-3 py-2 text-sm border border-[#e5e5e5] bg-[#f9f9f9] text-[#999] cursor-not-allowed font-sans"
            />
          </div>
          <div>
            <label className="block text-xs text-[#9ca3af] mb-1.5 tracking-wide">新密码</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="留空表示不修改"
              className="w-full px-3 py-2 text-sm border border-[#e5e5e5] bg-white text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] transition-colors font-sans"
            />
          </div>
          <div>
            <label className="block text-xs text-[#9ca3af] mb-1.5 tracking-wide">确认新密码</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="再次输入新密码"
              className="w-full px-3 py-2 text-sm border border-[#e5e5e5] bg-white text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] transition-colors font-sans"
            />
          </div>
          <button
            type="submit"
            className="text-sm px-6 py-2.5 bg-[#1a1a1a] text-white hover:bg-[#333] transition-colors tracking-wide"
          >
            修改密码
          </button>
        </form>
      </section>
      
      {/* 网站文本配置 */}
      {Object.entries(groups).map(([group, items]) => (
        <section key={group} className="mb-10">
          <h2 className="font-serif text-sm font-semibold text-[#1a1a1a] tracking-wide uppercase border-b border-[#e5e5e5] pb-2 mb-4">
            {groupLabels[group] || group}
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSave(group, items)
            }}
            className="space-y-4"
          >
            {items.map((c: any) => (
              <div key={c.key}>
                <label className="block text-xs text-[#9ca3af] mb-1.5 tracking-wide">
                  {c.label}
                </label>
                {c.key === 'footer_content' || c.value.length > 60 ? (
                  <textarea
                    name={c.key}
                    defaultValue={c.value}
                    rows={4}
                    className="w-full px-3 py-2 text-sm border border-[#e5e5e5] bg-white text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] transition-colors resize-none font-sans"
                  />
                ) : (
                  <input
                    name={c.key}
                    defaultValue={c.value}
                    className="w-full px-3 py-2 text-sm border border-[#e5e5e5] bg-white text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] transition-colors font-sans"
                  />
                )}
              </div>
            ))}
            
            <button
              type="submit"
              disabled={saving}
              className="text-sm px-6 py-2.5 bg-[#1a1a1a] text-white hover:bg-[#333] transition-colors tracking-wide disabled:opacity-50"
            >
              {saving ? '保存中...' : '保存更改'}
            </button>
          </form>
        </section>
      ))}
    </div>
  )
}
