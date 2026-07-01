'use client'
import { useState } from 'react'
import type { Nurse, NursePosition, NurseGroup } from '@/lib/types'
import { POSITIONS } from '@/lib/constants'
import { rnLevelFromStartDate, yearsOfService } from '@/lib/level'

const POSITION_COLOR: Record<string, string> = {
  HOD: 'bg-purple-100 text-purple-700',
  CNS: 'bg-indigo-100 text-indigo-700',
  RN4: 'bg-blue-100 text-blue-700',
  RN3: 'bg-blue-100 text-blue-700',
  RN2: 'bg-sky-100 text-sky-700',
  RN1: 'bg-sky-50 text-sky-600',
  RN0: 'bg-gray-100 text-gray-600',
  CO:  'bg-teal-100 text-teal-700',
  PN:  'bg-orange-50 text-orange-600',
  WC:  'bg-rose-50 text-rose-600',
}

interface FormState {
  name: string
  position: NursePosition
  group: NurseGroup
  nickname: string
  phone: string
  emp_code: string
  start_date: string
  day_only: boolean
}

const EMPTY_FORM: FormState = {
  name: '', position: 'RN2', group: 'RN',
  nickname: '', phone: '', emp_code: '', start_date: '', day_only: false,
}

export default function StaffModal({
  nurses, onAdd, onUpdate, onRemove, onToggle, onClose,
}: {
  nurses: Nurse[]
  onAdd: (n: Omit<Nurse, 'id' | 'order'>) => void
  onUpdate: (id: string, patch: Partial<Nurse>) => void
  onRemove: (id: string) => void
  onToggle: (id: string) => void
  onClose: () => void
}) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)

  const rn = nurses.filter(n => n.group === 'RN')
  const pn = nurses.filter(n => n.group === 'PN')

  function openAdd() {
    setForm(EMPTY_FORM); setEditingId(null); setShowForm(true)
  }
  function openEdit(n: Nurse) {
    setForm({
      name: n.name, position: n.position, group: n.group,
      nickname: n.nickname ?? '', phone: n.phone ?? '',
      emp_code: n.emp_code ?? '', start_date: n.start_date ?? '', day_only: n.day_only ?? false,
    })
    setEditingId(n.id); setShowForm(true)
  }

  // เปลี่ยนวันเริ่มงาน → ถ้าเป็น RN ให้คำนวณ level (RN1/2/3) อัตโนมัติ
  function onStartDateChange(v: string) {
    setForm(f => {
      const next = { ...f, start_date: v }
      if (f.group === 'RN' && !['CNS', 'RN4', 'CO', 'HOD'].includes(f.position)) {
        const lvl = rnLevelFromStartDate(v)
        if (lvl) next.position = lvl
      }
      return next
    })
  }
  function save() {
    if (!form.name.trim()) return
    if (editingId) {
      onUpdate(editingId, { ...form, name: form.name.trim() })
    } else {
      onAdd({ ...form, name: form.name.trim(), active: true })
    }
    setShowForm(false); setEditingId(null); setForm(EMPTY_FORM)
  }
  function confirmRemove(n: Nurse) {
    if (confirm(`ลบ ${n.name}?`)) onRemove(n.id)
  }

  const fieldCls = 'w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400'

  function row(n: Nurse) {
    const posStyle = POSITION_COLOR[n.position] ?? 'bg-gray-100 text-gray-600'
    return (
      <div key={n.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${n.active ? 'bg-white border-gray-100' : 'bg-gray-50 border-gray-100 opacity-50'}`}>
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${posStyle}`}>{n.position}</span>
        <span className="text-sm text-gray-700">{n.name}</span>
        {n.nickname && <span className="text-xs text-gray-400">({n.nickname})</span>}
        {n.day_only && <span className="text-[10px] bg-amber-50 text-amber-600 px-1 rounded">D-only</span>}
        {n.phone && <span className="text-xs text-gray-400 hidden sm:inline">{n.phone}</span>}
        <div className="ml-auto flex items-center gap-1">
          <button onClick={() => openEdit(n)} title="แก้ไข"
            className="p-1 text-gray-400 hover:text-teal-600 text-sm">✏️</button>
          <button onClick={() => onToggle(n.id)} title={n.active ? 'ปิดใช้งาน' : 'เปิดใช้งาน'}
            className="p-1 text-gray-400 hover:text-amber-600 text-sm">{n.active ? '🚫' : '✅'}</button>
          <button onClick={() => confirmRemove(n)} title="ลบ"
            className="p-1 text-gray-400 hover:text-red-500 text-sm">🗑</button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">บุคลากร ({nurses.length} คน)</h3>
          <div className="flex items-center gap-2">
            <button onClick={openAdd}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700">
              + เพิ่มบุคลากร
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
        </div>

        {showForm && (
          <div className="px-5 py-4 bg-teal-50/50 border-b border-teal-100 space-y-3">
            <div className="text-sm font-semibold text-gray-700">{editingId ? 'แก้ไขข้อมูล' : 'เพิ่มบุคลากรใหม่'}</div>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="ชื่อ-นามสกุล" className={fieldCls} autoFocus />
            <div className="flex gap-2">
              <input value={form.nickname} onChange={e => setForm({ ...form, nickname: e.target.value })}
                placeholder="ชื่อเล่น" className={fieldCls} />
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="เบอร์โทร" className={fieldCls} />
            </div>
            <div className="flex gap-2">
              <select value={form.position}
                onChange={e => {
                  const pos = e.target.value as NursePosition
                  const grp = POSITIONS.find(p => p.value === pos)?.group ?? form.group
                  setForm({ ...form, position: pos, group: grp })
                }}
                className={fieldCls}>
                {POSITIONS.map(p => (
                  <option key={p.value} value={p.value}>{p.icon} {p.label}</option>
                ))}
              </select>
              <input value={form.emp_code} onChange={e => setForm({ ...form, emp_code: e.target.value })}
                placeholder="รหัสพนักงาน" className={fieldCls} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <input value={form.start_date} onChange={e => onStartDateChange(e.target.value)}
                  placeholder="วันเริ่มงาน (พ.ศ.) เช่น 1 ก.ค.2565" className={fieldCls} />
                {(() => {
                  const yrs = yearsOfService(form.start_date)
                  if (yrs == null) return null
                  const lvl = form.position === 'RN1' ? 'L1' : form.position === 'RN2' ? 'L2' : form.position === 'RN3' ? 'L3' : ''
                  return (
                    <span className="whitespace-nowrap text-xs text-teal-600 font-medium">
                      อายุงาน {yrs.toFixed(1)} ปี{lvl && form.group === 'RN' ? ` · ${lvl}` : ''}
                    </span>
                  )
                })()}
              </div>
              {form.group === 'RN' && !['CNS', 'RN4', 'CO', 'HOD'].includes(form.position) && (
                <div className="text-[10px] text-gray-400 mt-1">RN ในวอร์ด IPD: ระบบตั้ง level อัตโนมัติจากวันเริ่มงาน (&lt;2ปี=L1, 2-4ปี=L2, &gt;4ปี=L3)</div>
              )}
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" checked={form.day_only}
                onChange={e => setForm({ ...form, day_only: e.target.checked })} />
              ขึ้นได้เฉพาะเวร D เท่านั้น
            </label>
            <div className="flex gap-2">
              <button onClick={() => { setShowForm(false); setEditingId(null) }}
                className="flex-1 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-white">ยกเลิก</button>
              <button onClick={save} disabled={!form.name.trim()}
                className="flex-1 py-2 text-sm font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 disabled:opacity-40">
                {editingId ? 'บันทึก' : 'เพิ่ม'}
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
          <div>
            <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">RN — พยาบาลวิชาชีพ ({rn.length})</div>
            <div className="space-y-1.5">{rn.map(row)}</div>
          </div>
          <div>
            <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">PN — พยาบาลเทคนิค ({pn.length})</div>
            <div className="space-y-1.5">{pn.map(row)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
