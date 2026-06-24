import AdminClient from './AdminClient'
import { Suspense } from 'react'

export default function AdminPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '40px', color: '#aaa' }}>加载中...</div>}>
      <AdminClient />
    </Suspense>
  )
}
