'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Category {
  id: string
  name: string
  parentId: string | null
  children: Category[]
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [parentCount, setParentCount] = useState(0)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    loadCategories()
  }, [])
  
  const loadCategories = () => {
    setLoading(true)
    fetch('/api/admin/categories')
      .then(res => res.json())
      .then(data => {
        console.log('获取到的分类数据：', data)
        setCategories(data.categories || data)
        setParentCount(data.stats?.parentCount || 0)
        setLoading(false)
      })
      .catch(err => {
        console.error('加载失败：', err)
        setLoading(false)
      })
  }
  
  const deleteCategory = (id: string, name: string) => {
    if (window.confirm(`确定要删除「${name}」吗？`)) {
      fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
        .then(res => {
          if (res.ok) {
            window.alert('删除成功')
            loadCategories()
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
  
  // 分组：父类 + 其下子类
  const parents = categories.filter(c => !c.parentId)
  
  return (
    <div>
      {/* 统计卡片 */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ 
          display: 'inline-block',
          padding: '20px 30px', 
          backgroundColor: '#fff', 
          border: '1px solid #eee', 
          borderRadius: '12px' 
        }}>
          <p style={{ fontSize: '18px', color: '#000', marginBottom: '5px' }}>大类数</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a1a' }}>{parentCount}</p>
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>分类管理</h1>
        <Link href="/admin/categories/new" style={{ 
          padding: '10px 20px', 
          backgroundColor: '#000', 
          color: '#fff', 
          textDecoration: 'none' 
        }}>
          新建分类
        </Link>
      </div>
      
      {parents.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999', padding: '40px' }}>暂无分类</p>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '20px' 
        }}>
          {parents.map((parent) => (
            <div key={parent.id} style={{ 
              border: '1px solid #eee',
              borderRadius: '12px',
              padding: '20px',
              backgroundColor: '#fff'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '15px',
                borderBottom: '1px solid #f5f5f5',
                paddingBottom: '15px'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a1a1a' }}>{parent.name}</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link 
                    href={`/admin/categories/${parent.id}/edit`}
                    style={{ 
                      padding: '5px 10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      color: '#333',
                      fontSize: '12px'
                    }}
                  >
                    编辑
                  </Link>
                  <button
                    type="button"
                    onClick={() => deleteCategory(parent.id, parent.name)}
                    style={{ 
                      padding: '5px 10px', 
                      backgroundColor: '#ff4444', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    删除
                  </button>
                </div>
              </div>
              
              {/* 子类列表 */}
              {parent.children.length > 0 ? (
                <div>
                  {parent.children.map((child) => (
                    <div key={child.id} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '10px 0',
                      borderBottom: '1px solid #fafafa'
                    }}>
                      <span style={{ fontSize: '13px', color: '#666' }}>↳ {child.name}</span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Link 
                          href={`/admin/categories/${child.id}/edit`}
                          style={{ 
                            fontSize: '11px', 
                            color: '#888', 
                            textDecoration: 'none' 
                          }}
                        >
                          编辑
                        </Link>
                        <button
                          type="button"
                          onClick={() => deleteCategory(child.id, child.name)}
                          style={{ 
                            fontSize: '11px', 
                            color: '#ff4444', 
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '12px', color: '#bbb' }}>暂无小类</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
