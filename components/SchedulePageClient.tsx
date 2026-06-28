'use client'
import { useAuth } from '@/lib/useAuth'
import { DEPT_LIST } from '@/lib/constants'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect } from 'react'
import type { Department } from '@/lib/types'
import ScheduleGrid from './ScheduleGrid'

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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-sm text-gray-400">กำลังโหลด...</div>
  )
  if (!dept) return (
    <div className="min-h-screen flex items-center justify-center text-sm text-red-500">ไม่พบแผนก {deptId}</div>
  )

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-bold ${
            dept.type === 'ICU' ? 'bg-teal-100 text-teal-700' : 'bg-blue-100 text-blue-700'
          }`}>{dept.name}</span>
          <span className="text-sm font-semibold text-gray-800">{dept.fullName}</span>
          <span className="text-xs text-gray-400 hidden sm:inline">{dept.type} · {dept.beds} เตียง</span>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-xs text-gray-500 hidden sm:inline">{user?.displayName}</span>
            <button
              onClick={signOut}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>
      </header>

      {/* Schedule grid — fills remaining height */}
      <div className="flex-1 overflow-hidden">
        <ScheduleGrid dept={deptId} />
      </div>
    </div>
  )
}
