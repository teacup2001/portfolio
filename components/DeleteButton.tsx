'use client'

interface DeleteButtonProps {
  id: string
  label: string
  type: 'work' | 'category'
}

export default function DeleteButton({ id, label, type }: DeleteButtonProps) {
  async function handleDelete() {
    alert('🟢 删除按钮被点击了！label=' + label)

    if (!confirm(`确定删除「${label}」吗？此操作不可撤销。`)) {
      alert('🟡 用户取消了删除')
      return
    }

    alert('🟡 用户确认删除，准备发送请求...')

    try {
      const url = `/api/admin/${type === 'work' ? 'works' : 'categories'}/${id}`
      alert('📡 请求 URL: ' + url)

      const res = await fetch(url, {
        method: 'DELETE',
        credentials: 'include',
      })

      alert('📥 响应状态码: ' + res.status)

      if (res.ok) {
        alert('✅ 删除成功！即将刷新页面...')
        window.location.reload()
      } else {
        const text = await res.text()
        alert('❌ 删除失败！状态码: ' + res.status + '\n响应: ' + text)
      }
    } catch (err: any) {
      alert('❌ 网络错误：' + err.message)
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="text-xs text-[#6b7280] hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer font-sans"
    >
      删除
    </button>
  )
}
