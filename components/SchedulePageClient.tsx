'use client'
import { useAuth } from '@/lib/useAuth'
import { DEPT_LIST } from '@/lib/constants'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect } from 'react'
import type { Department } from '@/lib/types'

export default function SchedulePageClient({ deptParam }: { deptParam: string }) {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const deptId = deptParam.toUpperCase() as Department
  const dept = DEPT_LIST.find(d => d.id === deptId)

  useEffect(() => {
    if (!loading && user && user.role !== 'admin' && user.department !== deptId) {
      router.replace('/')
    }
  }, [loading, user, deptId, router])

  if (loading) return <div className="min-h-screen flex items-center justify-center text-sm text-gray-400">กำลังโหลด...</div>
  if (!dept) return <div className="min-h-screen flex items-center justify-center text-sm text-red-500">ไม่พบแผนก {deptId}</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex items-center gap-2 flex-1">
            <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-bold ${
              dept.type === 'ICU' ? 'bg-teal-100 text-teal-700' : 'bg-blue-100 text-blue-700'
            }`}>{dept.name}</span>
            <span className="text-sm font-semibold text-gray-800">{dept.fullName}</span>
            <span className="text-xs text-gray-400">{dept.type} · {dept.beds} เตียง</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">{user?.displayName}</span>
            <button onClick={signOut} className="text-xs text-gray-400 hover:text-red-500 transition-colors">
              ออกจากระบบ
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-50 rounded-2xl mb-4">
          <svg className="w-8 h-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-gray-800 mb-2">ตารางเวร {dept.name}</h2>
        <p className="text-sm text-gray-400">กำลังพัฒนา — Phase 2</p>
      </main>
    </div>
  )
}
