'use client'
import { useState, useRef, useEffect } from 'react'
import type { Nurse } from '@/lib/types'
import {
  useSchedule, SHIFT_STYLE, daysInMonth, isWeekend, thaiDow,
  type ShiftCode, type PrelockEntry, type WarningEntry,
} from '@/lib/scheduleStore'

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

const WORK_SHIFTS: ShiftCode[] = ['D', 'N', 'S', 'CH']
const ALL_SHIFTS: ShiftCode[]  = ['D', 'N', 'S', 'CH', 'O', 'V', 'T', 'L']
const LEAVE_SHIFTS: ShiftCode[] = ['V', 'T', 'L', 'O']

// ── ShiftPicker popup ─────────────────────────────────────────────
function ShiftPicker({ current, onSelect, onClose }: {
  current: ShiftCode; onSelect: (s: ShiftCode) => void; onClose: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose() }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [onClose])

  return (
    <div ref={ref} className="absolute z-50 top-full left-1/2 -translate-x-1/2 mt-0.5 bg-white border border-gray-200 rounded-xl shadow-xl p-1.5 flex flex-wrap gap-1 w-36">
      {ALL_SHIFTS.map(s => {
        const st = SHIFT_STYLE[s]
        return (
          <button key={s} onClick={() => { onSelect(s); onClose() }}
            className={`w-9 h-8 rounded text-xs font-bold border transition-all ${s === current ? 'ring-2 ring-teal-400 border-transparent' : 'border-transparent hover:border-gray-300'}`}
            style={{ background: st.bg, color: st.text }}>
            {st.label || '–'}
          </button>
        )
      })}
      <button onClick={() => { onSelect(''); onClose() }}
        className="w-full h-7 rounded text-xs text-gray-400 hover:bg-gray-50 border border-dashed border-gray-200 mt-0.5">
        ล้าง
      </button>
    </div>
  )
}

// ── Pre-lock modal ────────────────────────────────────────────────
function PrelockModal({ nurses, year, month, onAdd, onClose }: {
  nurses: Nurse[]; year: number; month: number
  onAdd: (pl: PrelockEntry) => void; onClose: () => void
}) {
  const days = daysInMonth(year, month)
  const [nurseId, setNurseId] = useState(nurses[0]?.id ?? '')
  const [shift, setShift]     = useState<ShiftCode>('O')
  const [selDays, setSelDays] = useState<Set<number>>(new Set())
  const [note, setNote]       = useState('')

  function toggle(d: number) {
    setSelDays(prev => { const n = new Set(prev); n.has(d) ? n.delete(d) : n.add(d); return n })
  }

  function save() {
    if (!nurseId || !selDays.size) return
    onAdd({ id: `pl_${Date.now()}`, nurseId, days: [...selDays].sort((a,b)=>a-b), shift, note })
    onClose()
  }

  const activeNurses = nurses.filter(n => n.active && n.position !== 'HOD')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">เพิ่มการจอง (Pre-lock)</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">พยาบาล</label>
            <select value={nurseId} onChange={e => setNurseId(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400">
              {activeNurses.map(n => (
                <option key={n.id} value={n.id}>{n.name} ({n.position})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">ประเภท</label>
            <div className="flex gap-1 flex-wrap">
              {[...LEAVE_SHIFTS, 'D', 'N'].map(s => {
                const st = SHIFT_STYLE[s as ShiftCode]
                return (
                  <button key={s} onClick={() => setShift(s as ShiftCode)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${shift === s ? 'ring-2 ring-teal-400 border-transparent' : 'border-gray-200 hover:border-gray-300'}`}
                    style={{ background: st.bg, color: st.text }}>
                    {st.label || s}
                  </button>
                )
              })}
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">เลือกวัน (คลิกหลายวันได้)</label>
            <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
              {Array.from({ length: days }, (_, i) => i + 1).map(d => {
                const dow = new Date(year, month - 1, d).getDay()
                const wknd = dow === 0 || dow === 6
                const sel = selDays.has(d)
                return (
                  <button key={d} onClick={() => toggle(d)}
                    className={`w-8 h-8 rounded text-xs font-semibold border transition-all ${sel ? 'bg-teal-500 text-white border-teal-500' : wknd ? 'bg-blue-50 text-blue-600 border-blue-100 hover:border-blue-300' : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'}`}>
                    {d}
                  </button>
                )
              })}
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">หมายเหตุ (ไม่จำเป็น)</label>
            <input value={note} onChange={e => setNote(e.target.value)} placeholder="เช่น ลาป่วย, นัดหมอ"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400" />
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">ยกเลิก</button>
          <button onClick={save} disabled={!selDays.size}
            className="flex-1 py-2 text-sm font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 disabled:opacity-40">
            บันทึก ({selDays.size} วัน)
          </button>
        </div>
      </div>
    </div>
  )
}

// ── OH Case picker modal ─────────────────────────────────────────
function OHModal({ year, month, onAdd, onClose }: {
  year: number; month: number
  onAdd: (opDay: number) => void; onClose: () => void
}) {
  const days = daysInMonth(year, month)
  const [opDay, setOpDay] = useState(1)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">เพิ่ม Open Heart Case</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-2 block">วันผ่าตัด (Day 0)</label>
          <div className="flex flex-wrap gap-1 max-h-40 overflow-y-auto">
            {Array.from({ length: days }, (_, i) => i + 1).map(d => {
              const dow = new Date(year, month - 1, d).getDay()
              const wknd = dow === 0 || dow === 6
              return (
                <button key={d} onClick={() => setOpDay(d)}
                  className={`w-9 h-9 rounded-lg text-xs font-semibold border transition-all ${opDay === d ? 'bg-red-500 text-white border-red-500' : wknd ? 'bg-blue-50 text-blue-600 border-blue-100 hover:border-blue-300' : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'}`}>
                  {d}
                </button>
              )
            })}
          </div>
          <div className="mt-3 p-2 bg-red-50 rounded-lg text-xs text-red-600">
            Day 0 ({opDay}): ≥2 OH-capable · Day 1-3 ({opDay+1}–{Math.min(opDay+3, days)}): ≥1 OH-capable
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">ยกเลิก</button>
          <button onClick={() => { onAdd(opDay); onClose() }}
            className="flex-1 py--2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 py-2">
            เพิ่ม OH Case
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Warning panel ────────────────────────────────────────────────
function WarningPanel({ warnings, onDismiss }: {
  warnings: WarningEntry[]
  onDismiss: (idx: number) => void
}) {
  const [expanded, setExpanded] = useState(false)
  if (warnings.length === 0) return null

  const crits = warnings.filter(w => w.severity === 'crit').length
  const warns = warnings.filter(w => w.severity === 'warn').length

  return (
    <div className="border-t border-gray-100 bg-white flex-shrink-0">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-2 px-4 py-2 text-xs hover:bg-gray-50 transition">
        {crits > 0 && (
          <span className="flex items-center gap-1 text-red-600 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            {crits} สำคัญ
          </span>
        )}
        {warns > 0 && (
          <span className="flex items-center gap-1 text-amber-600 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            {warns} แจ้งเตือน
          </span>
        )}
        <span className="text-gray-400 ml-auto">{expanded ? '▲ ซ่อน' : '▼ ดูคำเตือน'}</span>
      </button>
      {expanded && (
        <div className="px-4 pb-3 flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
          {warnings.map((w, i) => (
            <div key={i}
              className={`flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs border ${
                w.severity === 'crit'
                  ? 'bg-red-50 border-red-200 text-red-700'
                  : 'bg-amber-50 border-amber-200 text-amber-700'
              }`}>
              <span>{w.msg}</span>
              <button onClick={() => onDismiss(i)} className="opacity-40 hover:opacity-100 ml-1">✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Work count ─────────────────────────────────────────────────────
function countWork(schedule: Record<string, ShiftCode>, nurseId: string, days: number) {
  let c = 0
  for (let d = 1; d <= days; d++) {
    if (WORK_SHIFTS.includes(schedule[`${nurseId}-${d}`] as ShiftCode)) c++
  }
  return c
}

// ── Main component ─────────────────────────────────────────────────
export default function ScheduleGrid({ dept }: { dept: string }) {
  const {
    data, setShift, changeMonth, updateConfig,
    addPrelock, removePrelock,
    addOHCase, removeOHCase,
    autoSchedule, clearSchedule, dismissWarning,
    monthLabel,
  } = useSchedule(dept)

  const [picker, setPicker]       = useState<{ nurseId: string; day: number } | null>(null)
  const [showPrelock, setShowPrelock] = useState(false)
  const [showOH, setShowOH]       = useState(false)
  const [toast, setToast]         = useState('')

  const isCCU = dept === 'CCU'

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 3500) }

  if (!data) return <div className="flex items-center justify-center h-64 text-sm text-gray-400">กำลังโหลด...</div>

  const { year, month, nurses, schedule, prelocks, ohCases, config, warnings } = data
  const days = daysInMonth(year, month)
  const activeNurses = nurses.filter(n => n.active)
  const rnNurses = activeNurses.filter(n => n.group === 'RN')
  const pnNurses = activeNurses.filter(n => n.group === 'PN')

  const prelockDays = new Map<string, Set<number>>()
  for (const pl of prelocks) {
    if (!prelockDays.has(pl.nurseId)) prelockDays.set(pl.nurseId, new Set())
    pl.days.forEach(d => prelockDays.get(pl.nurseId)!.add(d))
  }

  // OH highlight: which days are OH days (Day0 = red, Day1-3 = orange)
  const ohDayMap = new Map<number, 'day0' | 'day1-3'>()
  for (const c of ohCases) {
    ohDayMap.set(c.opDay, 'day0')
    for (let i = 1; i <= 3; i++) {
      if (c.opDay + i <= days && !ohDayMap.has(c.opDay + i)) {
        ohDayMap.set(c.opDay + i, 'day1-3')
      }
    }
  }

  function handleAutoSchedule() {
    const report = autoSchedule()
    showToast(report[0] ?? '✓ จัดเสร็จแล้ว')
  }

  function handleClear() {
    if (!confirm('ล้างตารางเดือนนี้ทั้งหมด?')) return
    clearSchedule()
    showToast('ล้างตารางแล้ว')
  }

  function renderRow(nurse: Nurse) {
    const work = countWork(schedule, nurse.id, days)
    const posStyle = POSITION_COLOR[nurse.position] ?? 'bg-gray-100 text-gray-600'
    const isHOD = nurse.position === 'HOD'
    const plDays = prelockDays.get(nurse.id)

    return (
      <tr key={nurse.id} className="group hover:bg-gray-50/60">
        <td className="sticky left-0 z-10 bg-white group-hover:bg-gray-50/60 border-r border-gray-100 px-3 py-1.5 min-w-[180px]">
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${posStyle}`}>{nurse.position}</span>
            <span className={`text-xs ${isHOD ? 'text-gray-400 italic' : 'text-gray-700'}`}>{nurse.name}</span>
          </div>
        </td>
        {Array.from({ length: days }, (_, i) => {
          const day = i + 1
          const key = `${nurse.id}-${day}`
          const shift = schedule[key] || ''
          const st = SHIFT_STYLE[shift] ?? SHIFT_STYLE['']
          const weekend = isWeekend(year, month, day)
          const isLocked = plDays?.has(day)
          const isOpen = picker?.nurseId === nurse.id && picker?.day === day
          const ohType = ohDayMap.get(day)

          return (
            <td key={day}
              className={`relative border-r border-gray-100 p-0 ${weekend ? 'bg-blue-50/30' : ohType === 'day0' ? 'bg-red-50/40' : ohType === 'day1-3' ? 'bg-orange-50/30' : ''}`}
              style={{ width: 32, minWidth: 32 }}>
              {isHOD ? <div className="w-8 h-8" /> : (
                <button
                  onClick={() => isOpen ? setPicker(null) : setPicker({ nurseId: nurse.id, day })}
                  className={`w-full h-8 flex items-center justify-center text-[11px] font-bold rounded transition-all ${isLocked ? 'ring-1 ring-inset ring-teal-400' : 'hover:ring-2 hover:ring-teal-300'}`}
                  style={{ background: shift ? st.bg : 'transparent', color: shift ? st.text : '#d1d5db' }}>
                  {st.label || '·'}
                  {isLocked && <span className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-teal-500" />}
                </button>
              )}
              {isOpen && !isHOD && (
                <ShiftPicker current={shift as ShiftCode} onSelect={s => setShift(nurse.id, day, s)} onClose={() => setPicker(null)} />
              )}
            </td>
          )
        })}
        <td className="sticky right-0 bg-white border-l border-gray-100 text-center text-xs font-bold px-2 w-10">
          <span className={isHOD ? 'text-gray-300' : work < config.workDaysMin ? 'text-red-500' : work > config.workDaysMax ? 'text-amber-500' : 'text-teal-600'}>
            {isHOD ? '–' : work}
          </span>
        </td>
      </tr>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Sub-header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-white border-b border-gray-100 flex-wrap">
        {/* Month nav */}
        <button onClick={() => { const m=month===1?12:month-1; const y=month===1?year-1:year; changeMonth(y,m) }} className="p-1.5 rounded hover:bg-gray-100 text-gray-500">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
        </button>
        <span className="text-sm font-semibold text-gray-800 min-w-[130px] text-center">{monthLabel}</span>
        <button onClick={() => { const m=month===12?1:month+1; const y=month===12?year+1:year; changeMonth(y,m) }} className="p-1.5 rounded hover:bg-gray-100 text-gray-500">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
        </button>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        {/* RN/PN config */}
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <span>RN</span>
          <span className="text-gray-400">D</span>
          <input type="number" min={1} max={8} value={config.rnD} onChange={e => updateConfig({ rnD: +e.target.value })}
            className="w-8 text-center border border-gray-200 rounded text-xs py-0.5 focus:outline-none focus:ring-1 focus:ring-teal-400" />
          <span className="text-gray-400">N</span>
          <input type="number" min={1} max={8} value={config.rnN} onChange={e => updateConfig({ rnN: +e.target.value })}
            className="w-8 text-center border border-gray-200 rounded text-xs py-0.5 focus:outline-none focus:ring-1 focus:ring-teal-400" />
          <span className="ml-2">PN</span>
          <span className="text-gray-400">D</span>
          <input type="number" min={1} max={6} value={config.pnD} onChange={e => updateConfig({ pnD: +e.target.value })}
            className="w-8 text-center border border-gray-200 rounded text-xs py-0.5 focus:outline-none focus:ring-1 focus:ring-teal-400" />
          <span className="text-gray-400">N</span>
          <input type="number" min={1} max={6} value={config.pnN} onChange={e => updateConfig({ pnN: +e.target.value })}
            className="w-8 text-center border border-gray-200 rounded text-xs py-0.5 focus:outline-none focus:ring-1 focus:ring-teal-400" />
          <span className="ml-2 text-gray-400">เป้า</span>
          <input type="number" min={18} max={26} value={config.workDaysMin} onChange={e => updateConfig({ workDaysMin: +e.target.value })}
            className="w-8 text-center border border-gray-200 rounded text-xs py-0.5 focus:outline-none focus:ring-1 focus:ring-teal-400" />
          <span className="text-gray-400">–</span>
          <input type="number" min={18} max={26} value={config.workDaysMax} onChange={e => updateConfig({ workDaysMax: +e.target.value })}
            className="w-8 text-center border border-gray-200 rounded text-xs py-0.5 focus:outline-none focus:ring-1 focus:ring-teal-400" />
        </div>

        <div className="ml-auto flex items-center gap-2">
          {isCCU && (
            <button onClick={() => setShowOH(true)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition">
              ❤️ OH {ohCases.length > 0 && <span className="bg-red-500 text-white text-[10px] rounded-full px-1.5">{ohCases.length}</span>}
            </button>
          )}
          <button onClick={() => setShowPrelock(true)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            🔒 Pre-lock {prelocks.length > 0 && <span className="bg-teal-500 text-white text-[10px] rounded-full px-1.5">{prelocks.length}</span>}
          </button>
          <button onClick={handleAutoSchedule}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition shadow-sm">
            ⚡ จัดเวรเดือนนี้
          </button>
          <button onClick={handleClear}
            className="px-3 py-1.5 text-xs text-gray-400 hover:text-red-500 border border-gray-200 rounded-lg hover:border-red-200 transition">
            ล้าง
          </button>
        </div>
      </div>

      {/* Shift legend */}
      <div className="flex items-center gap-1 px-4 py-1 bg-gray-50 border-b border-gray-100">
        {ALL_SHIFTS.map(s => {
          const st = SHIFT_STYLE[s]
          return st.label ? (
            <span key={s} className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ background: st.bg, color: st.text }}>{st.label}</span>
          ) : null
        })}
        {isCCU && <span className="ml-2 flex items-center gap-1 text-[10px] text-red-400"><span className="w-2 h-2 rounded-sm bg-red-100 inline-block border border-red-200" /> OH Day0</span>}
        {isCCU && <span className="flex items-center gap-1 text-[10px] text-orange-400"><span className="w-2 h-2 rounded-sm bg-orange-50 inline-block border border-orange-200" /> Day1-3</span>}
        <span className="ml-auto text-[10px] text-gray-400">คลิกช่องเพื่อเลือกเวร</span>
      </div>

      {/* OH Cases bar */}
      {isCCU && ohCases.length > 0 && (
        <div className="px-4 py-2 bg-red-50 border-b border-red-100 flex flex-wrap gap-2 items-center">
          <span className="text-[10px] font-semibold text-red-500 uppercase tracking-wide">Open Heart</span>
          {ohCases.map(c => (
            <div key={c.id} className="flex items-center gap-1 bg-white border border-red-200 rounded-lg px-2 py-1 text-xs">
              <span className="font-bold text-red-600">Day0={c.opDay}</span>
              <span className="text-gray-400">D1-3: {c.opDay+1}–{Math.min(c.opDay+3, days)}</span>
              <button onClick={() => removeOHCase(c.id)} className="text-gray-300 hover:text-red-400 ml-1">✕</button>
            </div>
          ))}
        </div>
      )}

      {/* Pre-lock list */}
      {prelocks.length > 0 && (
        <div className="px-4 py-2 bg-teal-50 border-b border-teal-100 flex flex-wrap gap-2">
          {prelocks.map(pl => {
            const nurse = nurses.find(n => n.id === pl.nurseId)
            const st = SHIFT_STYLE[pl.shift]
            return (
              <div key={pl.id} className="flex items-center gap-1.5 bg-white border border-teal-200 rounded-lg px-2 py-1 text-xs">
                <span className="font-medium text-gray-700">{nurse?.name.split(' ')[0]}</span>
                <span className="px-1 rounded font-bold text-[10px]" style={{ background: st.bg, color: st.text }}>{st.label || pl.shift}</span>
                <span className="text-gray-500">วันที่ {pl.days.join(', ')}</span>
                {pl.note && <span className="text-gray-400">({pl.note})</span>}
                <button onClick={() => removePrelock(pl.id)} className="text-gray-300 hover:text-red-400 ml-1">✕</button>
              </div>
            )
          })}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-gray-800 text-white text-sm px-4 py-2 rounded-xl shadow-lg">
          {toast}
        </div>
      )}

      {/* Grid */}
      <div className="flex-1 overflow-auto">
        <table className="border-collapse text-xs" style={{ tableLayout: 'fixed' }}>
          <thead className="sticky top-0 z-20 bg-white">
            <tr>
              <th className="sticky left-0 z-30 bg-white border-b border-r border-gray-200 px-3 py-1.5 text-left text-[11px] text-gray-500 font-medium min-w-[180px]">พยาบาล</th>
              {Array.from({ length: days }, (_, i) => {
                const d = i + 1
                const weekend = isWeekend(year, month, d)
                const ohType = ohDayMap.get(d)
                return (
                  <th key={d}
                    className={`border-b border-r border-gray-200 py-1 text-center ${weekend ? 'bg-blue-50' : ohType === 'day0' ? 'bg-red-50' : ohType === 'day1-3' ? 'bg-orange-50' : 'bg-white'}`}
                    style={{ width: 32, minWidth: 32 }}>
                    <div className={`text-[9px] ${weekend ? 'text-blue-400' : ohType ? 'text-red-400' : 'text-gray-400'}`}>{thaiDow(year, month, d)}</div>
                    <div className={`text-[11px] font-semibold ${weekend ? 'text-blue-600' : ohType === 'day0' ? 'text-red-600' : ohType === 'day1-3' ? 'text-orange-500' : 'text-gray-700'}`}>{d}</div>
                  </th>
                )
              })}
              <th className="sticky right-0 z-30 bg-white border-b border-l border-gray-200 w-10 text-center text-[11px] text-gray-500 font-medium px-1">วัน</th>
            </tr>
          </thead>
          <tbody>
            {rnNurses.length > 0 && (
              <tr><td colSpan={days + 2} className="bg-gray-50 px-3 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100">
                RN · พยาบาลวิชาชีพ ({rnNurses.length} คน)
              </td></tr>
            )}
            {rnNurses.map(renderRow)}
            {pnNurses.length > 0 && (
              <tr><td colSpan={days + 2} className="bg-gray-50 px-3 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wide border-b border-t border-gray-100">
                PN · พยาบาลเทคนิค ({pnNurses.length} คน)
              </td></tr>
            )}
            {pnNurses.map(renderRow)}
            {/* Day summary */}
            <tr className="bg-gray-50 border-t border-gray-200">
              <td className="sticky left-0 bg-gray-50 border-r border-gray-200 px-3 py-1 text-[10px] font-semibold text-gray-500">รวม D / N</td>
              {Array.from({ length: days }, (_, i) => {
                const d = i + 1
                const dCount = activeNurses.filter(n => n.position !== 'HOD' && schedule[`${n.id}-${d}`] === 'D').length
                const nCount = activeNurses.filter(n => n.position !== 'HOD' && schedule[`${n.id}-${d}`] === 'N').length
                return (
                  <td key={d} className="border-r border-gray-200 text-center py-1" style={{ width: 32 }}>
                    <div className="text-[9px] font-bold text-blue-600">{dCount || ''}</div>
                    <div className="text-[9px] font-bold text-purple-600">{nCount || ''}</div>
                  </td>
                )
              })}
              <td className="sticky right-0 bg-gray-50 border-l border-gray-200" />
            </tr>
          </tbody>
        </table>
      </div>

      {/* Warning panel */}
      <WarningPanel warnings={warnings} onDismiss={dismissWarning} />

      {/* Modals */}
      {showPrelock && (
        <PrelockModal nurses={nurses} year={year} month={month}
          onAdd={pl => { addPrelock(pl); setShowPrelock(false) }}
          onClose={() => setShowPrelock(false)} />
      )}
      {showOH && (
        <OHModal year={year} month={month}
          onAdd={d => { addOHCase(d); setShowOH(false) }}
          onClose={() => setShowOH(false)} />
      )}
    </div>
  )
}
