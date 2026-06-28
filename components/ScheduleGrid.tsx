'use client'
import { useState, useRef, useEffect } from 'react'
import type { Nurse } from '@/lib/types'
import {
  useSchedule, SHIFT_STYLE, daysInMonth, isWeekend, thaiDow, cycleShift,
  type ShiftCode,
} from '@/lib/scheduleStore'
import { THAI_MONTHS_SHORT } from '@/lib/constants'

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

const ALL_SHIFTS: ShiftCode[] = ['D', 'N', 'S', 'CH', 'O', 'V', 'T', 'L']

function ShiftPicker({
  current, onSelect, onClose,
}: { current: ShiftCode; onSelect: (s: ShiftCode) => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [onClose])

  return (
    <div
      ref={ref}
      className="absolute z-50 top-full left-1/2 -translate-x-1/2 mt-0.5 bg-white border border-gray-200 rounded-lg shadow-lg p-1.5 flex flex-wrap gap-1 w-36"
    >
      {ALL_SHIFTS.map(s => {
        const st = SHIFT_STYLE[s]
        return (
          <button
            key={s}
            onClick={() => { onSelect(s); onClose() }}
            className={`w-9 h-8 rounded text-xs font-bold border transition-all ${
              s === current ? 'ring-2 ring-teal-400 border-transparent' : 'border-transparent hover:border-gray-300'
            }`}
            style={{ background: st.bg, color: st.text }}
          >
            {st.label || '–'}
          </button>
        )
      })}
      <button
        onClick={() => { onSelect(''); onClose() }}
        className="w-full h-7 rounded text-xs text-gray-400 hover:bg-gray-50 border border-dashed border-gray-200 mt-0.5"
      >
        ล้าง
      </button>
    </div>
  )
}

function countShifts(schedule: Record<string, ShiftCode>, nurseId: string, days: number) {
  let work = 0
  for (let d = 1; d <= days; d++) {
    const s = schedule[`${nurseId}-${d}`] || ''
    if (['D', 'N', 'S', 'CH', 'V', 'T', 'L'].includes(s)) work++
  }
  return work
}

export default function ScheduleGrid({ dept }: { dept: string }) {
  const { data, setShift, changeMonth, monthLabel } = useSchedule(dept)
  const [picker, setPicker] = useState<{ nurseId: string; day: number } | null>(null)

  if (!data) return (
    <div className="flex items-center justify-center h-64 text-sm text-gray-400">กำลังโหลด...</div>
  )

  const { year, month, nurses, schedule } = data
  const days = daysInMonth(year, month)
  const activeNurses = nurses.filter(n => n.active)
  const rnNurses = activeNurses.filter(n => n.group === 'RN')
  const pnNurses = activeNurses.filter(n => n.group === 'PN')

  function prevMonth() {
    if (month === 1) changeMonth(year - 1, 12)
    else changeMonth(year, month - 1)
  }
  function nextMonth() {
    if (month === 12) changeMonth(year + 1, 1)
    else changeMonth(year, month + 1)
  }

  function handleCellClick(nurseId: string, day: number) {
    if (picker?.nurseId === nurseId && picker?.day === day) {
      setPicker(null)
    } else {
      setPicker({ nurseId, day })
    }
  }

  function renderRow(nurse: Nurse) {
    const work = countShifts(schedule, nurse.id, days)
    const posStyle = POSITION_COLOR[nurse.position] ?? 'bg-gray-100 text-gray-600'
    const isHOD = nurse.position === 'HOD'

    return (
      <tr key={nurse.id} className="group hover:bg-gray-50/50">
        {/* Nurse info */}
        <td className="sticky left-0 z-10 bg-white group-hover:bg-gray-50/50 border-r border-gray-100 px-3 py-1.5 min-w-[180px]">
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${posStyle}`}>
              {nurse.position}
            </span>
            <span className={`text-xs ${isHOD ? 'text-gray-400 italic' : 'text-gray-700'}`}>
              {nurse.name}
            </span>
          </div>
        </td>
        {/* Day cells */}
        {Array.from({ length: days }, (_, i) => {
          const day = i + 1
          const key = `${nurse.id}-${day}`
          const shift = schedule[key] || ''
          const st = SHIFT_STYLE[shift] ?? SHIFT_STYLE['']
          const weekend = isWeekend(year, month, day)
          const isOpen = picker?.nurseId === nurse.id && picker?.day === day

          return (
            <td
              key={day}
              className={`relative border-r border-gray-100 p-0 ${weekend ? 'bg-blue-50/30' : ''}`}
              style={{ width: 32, minWidth: 32 }}
            >
              {isHOD ? (
                <div className="w-8 h-8" />
              ) : (
                <button
                  onClick={() => handleCellClick(nurse.id, day)}
                  className="w-full h-8 flex items-center justify-center text-[11px] font-bold rounded transition-all hover:ring-2 hover:ring-teal-300"
                  style={{
                    background: shift ? st.bg : 'transparent',
                    color: shift ? st.text : '#d1d5db',
                  }}
                >
                  {st.label || '·'}
                </button>
              )}
              {isOpen && !isHOD && (
                <ShiftPicker
                  current={shift as ShiftCode}
                  onSelect={s => setShift(nurse.id, day, s)}
                  onClose={() => setPicker(null)}
                />
              )}
            </td>
          )
        })}
        {/* Count */}
        <td className="sticky right-0 bg-white border-l border-gray-100 text-center text-xs font-bold px-2 w-10">
          <span className={work < 21 ? 'text-red-500' : work > 23 ? 'text-amber-500' : 'text-teal-600'}>
            {isHOD ? '–' : work}
          </span>
        </td>
      </tr>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Month nav */}
      <div className="flex items-center gap-3 px-4 py-2 bg-white border-b border-gray-100">
        <button onClick={prevMonth} className="p-1.5 rounded hover:bg-gray-100 text-gray-500 transition">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-sm font-semibold text-gray-800 min-w-[140px] text-center">{monthLabel}</span>
        <button onClick={nextMonth} className="p-1.5 rounded hover:bg-gray-100 text-gray-500 transition">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <div className="ml-auto flex gap-1 text-[10px]">
          {ALL_SHIFTS.map(s => {
            const st = SHIFT_STYLE[s]
            return st.label ? (
              <span key={s} className="px-1.5 py-0.5 rounded font-bold" style={{ background: st.bg, color: st.text }}>
                {st.label}
              </span>
            ) : null
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-auto">
        <table className="border-collapse text-xs" style={{ tableLayout: 'fixed' }}>
          <thead className="sticky top-0 z-20 bg-white">
            <tr>
              <th className="sticky left-0 z-30 bg-white border-b border-r border-gray-200 px-3 py-1 text-left text-[11px] text-gray-500 font-medium min-w-[180px]">
                พยาบาล
              </th>
              {Array.from({ length: days }, (_, i) => {
                const d = i + 1
                const dow = thaiDow(year, month, d)
                const weekend = isWeekend(year, month, d)
                return (
                  <th
                    key={d}
                    className={`border-b border-r border-gray-200 py-1 text-center ${weekend ? 'bg-blue-50' : 'bg-white'}`}
                    style={{ width: 32, minWidth: 32 }}
                  >
                    <div className={`text-[9px] ${weekend ? 'text-blue-400' : 'text-gray-400'}`}>{dow}</div>
                    <div className={`text-[11px] font-semibold ${weekend ? 'text-blue-600' : 'text-gray-700'}`}>{d}</div>
                  </th>
                )
              })}
              <th className="sticky right-0 z-30 bg-white border-b border-l border-gray-200 w-10 text-center text-[11px] text-gray-500 font-medium px-1">
                วัน
              </th>
            </tr>
          </thead>
          <tbody>
            {/* RN section */}
            {rnNurses.length > 0 && (
              <tr>
                <td colSpan={days + 2} className="bg-gray-50 px-3 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100">
                  RN — พยาบาลวิชาชีพ ({rnNurses.length} คน)
                </td>
              </tr>
            )}
            {rnNurses.map(renderRow)}
            {/* PN section */}
            {pnNurses.length > 0 && (
              <tr>
                <td colSpan={days + 2} className="bg-gray-50 px-3 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wide border-b border-t border-gray-100">
                  PN — พยาบาลเทคนิค ({pnNurses.length} คน)
                </td>
              </tr>
            )}
            {pnNurses.map(renderRow)}
            {/* Day summary row */}
            <tr className="bg-gray-50 border-t border-gray-200">
              <td className="sticky left-0 bg-gray-50 border-r border-gray-200 px-3 py-1 text-[10px] font-semibold text-gray-500">
                รวม D / N
              </td>
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
    </div>
  )
}
