'use client'
import { useAuth } from '@/lib/useAuth'
import { DEPT_LIST } from '@/lib/constants'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Home() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
        กำลังโหลด...
      </div>
    )
  }

  // กรองแผนกตามสิทธิ์
  const visibleDepts = user?.role === 'admin'
    ? DEPT_LIST
    : DEPT_LIST.filter(d => d.id === user?.department)

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-gray-900">ระบบจัดตารางเวรพยาบาล</h1>
            <p className="text-xs text-gray-400 mt-0.5">รพ.พญาไทศรีราชา</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-semibold text-gray-700">{user?.displayName}</p>
              <p className="text-xs text-gray-400">{user?.role === 'admin' ? 'ผู้ดูแลระบบ' : user?.department}</p>
            </div>
            <button
              onClick={signOut}
              className="text-xs text-gray-500 hover:text-red-600 border border-gray-200 hover:border-red-200 rounded-lg px-3 py-1.5 transition-colors"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-5">
          เลือกแผนก
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {visibleDepts.map(dept => (
            <Link
              key={dept.id}
              href={`/schedule/${dept.id.toLowerCase()}`}
              className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-teal-400 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold ${
                  dept.type === 'ICU'
                    ? 'bg-teal-100 text-teal-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {dept.name}
                </span>
                {dept.hasOH && (
                  <span className="text-xs text-red-500 font-medium">OH</span>
                )}
              </div>
              <p className="text-sm font-semibold text-gray-800 group-hover:text-teal-700 transition-colors">
                {dept.fullName}
              </p>
              <p className="text-xs text-gray-400 mt-1">{dept.type} · {dept.beds} เตียง</p>
            </Link>
          ))}
        </div>

        {/* Admin: แสดง user list */}
        {user?.role === 'admin' && (
          <div className="mt-10">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              บัญชีผู้ใช้
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Username</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">แผนก</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">สิทธิ์</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">รหัสผ่าน</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { u: 'admin', dept: 'ทุกแผนก', role: 'Admin',   pass: 'admin1234' },
                    { u: 'ccu',   dept: 'CCU',     role: 'Ward', pass: 'CCU' },
                    { u: 'ncu',   dept: 'NCU',     role: 'Ward', pass: 'NCU' },
                    { u: 'icu',   dept: 'ICU',     role: 'Ward', pass: 'ICU' },
                    { u: 'w5a',   dept: 'W.5A',    role: 'Ward', pass: 'W5A' },
                    { u: 'w6a',   dept: 'W.6A',    role: 'Ward', pass: 'W6A' },
                    { u: 'w6b',   dept: 'W.6B',    role: 'Ward', pass: 'W6B' },
                    { u: 'w7a',   dept: 'W.7A',    role: 'Ward', pass: 'W7A' },
                    { u: 'w8a',   dept: 'W.8A',    role: 'Ward', pass: 'W8A' },
                    { u: 'w9a',   dept: 'W.9A',    role: 'Ward', pass: 'W9A' },
                    { u: 'w10a',  dept: 'W.10A',   role: 'Ward', pass: 'W10A' },
                    { u: 'w11a',  dept: 'W.11A',   role: 'Ward', pass: 'W11A' },
                    { u: 'w12a',  dept: 'W.12A',   role: 'Ward', pass: 'W12A' },
                  ].map(row => (
                    <tr key={row.u} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-gray-800">{row.u}</td>
                      <td className="px-4 py-3 text-gray-600">{row.dept}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          row.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-teal-100 text-teal-700'
                        }`}>{row.role}</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-gray-500 text-xs">{row.pass}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
