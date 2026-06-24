'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Work {
  id: string
  title: string
  slug: string
  category: { name: string }
  parentCategory?: { name: string }
  updatedAt: string
}

export default function Works() {
  const [works, setWorks] = useState<Work[]>([])
  const [loading, setLoading] = useState(true)
  const [workCount, setWorkCount] = useState(0)
  
  useEffect(() => {
    fetch('/api/admin/works')
      .then(res => res.json())
      .then(data => {
        console.log('获取到的数据：', data)
        // API 直接返回数组，不是 { works: [...] }
        setWorks(Array.isArray(data) ? data : (data.works || []))
        setWorkCount(Array.isArray(data) ? data.length : (data.stats?.workCount || 0))
        setLoading(false)
      })
      .catch(err => {
        console.error('加载失败：', err)
        setLoading(false)
      })
  }, [])
  
  const deleteWork = (id: string, title: string) => {
    if (window.confirm(`确定要删除「${title}」吗？`)) {
      fetch(`/api/admin/works/${id}`, { method: 'DELETE' })
        .then(res => {
          if (res.ok) {
            window.alert('删除成功')
            window.location.reload()
          } else {
            window.alert('删除失败')
          }
        })
        .catch(err => {
          window.alert('删除失败：' + err.message)
        })
    }
  }
  
  if (loading) {
    return <div>加载中...</div>
  }
  
  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>作品管理（共 {workCount} 个作品）</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <Link href="/admin/works/new" style={{ 
          padding: '10px 20px', 
          backgroundColor: '#000', 
          color: '#fff', 
          textDecoration: 'none',
          display: 'inline-block'
        }}>
          新建作品
        </Link>
      </div>
      
      {works.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999', padding: '40px' }}>暂无作品</p>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
          gap: '20px' 
        }}>
          {works.map(work => (
            <div key={work.id} style={{ 
              border: '1px solid #eee',
              borderRadius: '12px',
              padding: '20px',
              backgroundColor: '#fff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <h3 style={{ 
                  fontSize: '16px', 
                  fontWeight: 'bold', 
                  marginBottom: '10px',
                  color: '#1a1a1a'
                }}>
                  {work.title}
                </h3>
                <p style={{ 
                  fontSize: '13px', 
                  color: '#999', 
                  marginBottom: '15px' 
                }}>
                  {work.parentCategory?.name ? `${work.parentCategory.name} — ${work.category.name}` : work.category.name}
                </p>
                <p style={{ 
                  fontSize: '12px', 
                  color: '#bbb' 
                }}>
                  {new Date(work.updatedAt).toLocaleDateString('zh-CN')}
                </p>
              </div>
              
              <div style={{ 
                display: 'flex', 
                gap: '10px', 
                marginTop: '20px',
                borderTop: '1px solid #f5f5f5',
                paddingTop: '15px'
              }}>
                <Link 
                  href={`/admin/works/${work.id}/edit`}
                  style={{ 
                    flex: 1,
                    padding: '8px 0',
                    textAlign: 'center',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    color: '#333',
                    fontSize: '13px'
                  }}
                >
                  编辑
                </Link>
                <button
                  type="button"
                  onClick={() => deleteWork(work.id, work.title)}
                  style={{ 
                    flex: 1,
                    padding: '8px 0',
                    backgroundColor: '#ff4444', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
