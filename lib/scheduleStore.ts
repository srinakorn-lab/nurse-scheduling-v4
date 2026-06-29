'use client'
import { useState, useEffect, useCallback } from 'react'
import type { Nurse } from './types'
import { getDefaultNurses } from './nurseDefaults'
import { THAI_MONTHS } from './constants'
import { runAutoSchedule, DEFAULT_CONFIG } from './autoSchedule'
import type { AutoConfig, PrelockEntry, ShiftCode, OHCase, WarningEntry } from './autoSchedule'

export type { ShiftCode, PrelockEntry, AutoConfig, OHCase, WarningEntry }

export interface ScheduleData {
  year: number
  month: number
  nurses: Nurse[]
  schedule: Record<string, ShiftCode>
  prelocks: PrelockEntry[]
  ohCases: OHCase[]
  config: AutoConfig
  warnings: WarningEntry[]
  carryover: Record<string, ShiftCode>
}

const SHIFT_CYCLE: ShiftCode[] = ['D', 'N', 'O', 'V', 'T', 'L', '']

export const SHIFT_STYLE: Record<string, { label: string; bg: string; text: string }> = {
  D:  { label: 'D',  bg: '#dbeafe', text: '#1e40af' },
  N:  { label: 'N',  bg: '#ede9fe', text: '#4c1d95' },
  S:  { label: 'S',  bg: '#fef3c7', text: '#92400e' },
  CH: { label: 'ช',  bg: '#d1fae5', text: '#065f46' },
  O:  { label: 'O',  bg: '#f3f4f6', text: '#6b7280' },
  V:  { label: 'V',  bg: '#e0f2fe', text: '#0369a1' },
  T:  { label: 'T',  bg: '#e0f2fe', text: '#0369a1' },
  L:  { label: 'L',  bg: '#f5f3ff', text: '#7c3aed' },
  '': { label: '',   bg: 'transparent', text: '' },
}

const THAI_DOW = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']

export function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate()
}
export function getDow(year: number, month: number, day: number) {
  return new Date(year, month - 1, day).getDay()
}
export function isWeekend(year: number, month: number, day: number) {
  const d = getDow(year, month, day); return d === 0 || d === 6
}
export function thaiDow(year: number, month: number, day: number) {
  return THAI_DOW[getDow(year, month, day)]
}
export function cycleShift(current: ShiftCode): ShiftCode {
  const idx = SHIFT_CYCLE.indexOf(current)
  return SHIFT_CYCLE[(idx + 1) % SHIFT_CYCLE.length]
}

function storageKey(dept: string) { return `nurse_v4_${dept}` }

function makeEmpty(dept: string): ScheduleData {
  const now = new Date()
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    nurses: getDefaultNurses(dept),
    schedule: {},
    prelocks: [],
    ohCases: [],
    config: { ...DEFAULT_CONFIG },
    warnings: [],
    carryover: {},
  }
}

// Extract last shift per nurse from a schedule (for carryover)
function extractLastShifts(
  schedule: Record<string, ShiftCode>,
  nurses: Nurse[],
  days: number,
): Record<string, ShiftCode> {
  const result: Record<string, ShiftCode> = {}
  for (const n of nurses) {
    for (let d = days; d >= 1; d--) {
      const s = schedule[`${n.id}-${d}`]
      if (s && s !== 'O') {
        result[n.id] = s
        break
      }
    }
  }
  return result
}

export function useSchedule(dept: string) {
  const [data, setData] = useState<ScheduleData | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem(storageKey(dept))
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        if (!parsed.prelocks)  parsed.prelocks  = []
        if (!parsed.ohCases)   parsed.ohCases   = []
        if (!parsed.config)    parsed.config    = { ...DEFAULT_CONFIG }
        if (!parsed.warnings)  parsed.warnings  = []
        if (!parsed.carryover) parsed.carryover = {}
        setData(parsed); return
      } catch {}
    }
    setData(makeEmpty(dept))
  }, [dept])

  const save = useCallback((next: ScheduleData) => {
    setData(next)
    localStorage.setItem(storageKey(dept), JSON.stringify(next))
  }, [dept])

  const setShift = useCallback((nurseId: string, day: number, shift: ShiftCode) => {
    setData(prev => {
      if (!prev) return prev
      const next = { ...prev, schedule: { ...prev.schedule, [`${nurseId}-${day}`]: shift } }
      localStorage.setItem(storageKey(dept), JSON.stringify(next))
      return next
    })
  }, [dept])

  const changeMonth = useCallback((year: number, month: number) => {
    setData(prev => {
      if (!prev) return prev
      // compute carryover from current month before switching
      const days = daysInMonth(prev.year, prev.month)
      const newCarryover = extractLastShifts(prev.schedule, prev.nurses, days)

      // archive current month schedule
      const archKey = storageKey(dept) + '_all'
      const allRaw = localStorage.getItem(archKey)
      const all: Record<string, Record<string, ShiftCode>> = allRaw ? JSON.parse(allRaw) : {}
      all[`${prev.year}-${prev.month}`] = prev.schedule
      localStorage.setItem(archKey, JSON.stringify(all))

      const next: ScheduleData = {
        ...prev, year, month,
        schedule: all[`${year}-${month}`] ?? {},
        prelocks: [],
        ohCases: [],
        warnings: [],
        carryover: newCarryover,
      }
      localStorage.setItem(storageKey(dept), JSON.stringify(next))
      return next
    })
  }, [dept])

  const updateConfig = useCallback((cfg: Partial<AutoConfig>) => {
    setData(prev => {
      if (!prev) return prev
      const next = { ...prev, config: { ...prev.config, ...cfg } }
      localStorage.setItem(storageKey(dept), JSON.stringify(next))
      return next
    })
  }, [dept])

  const addPrelock = useCallback((pl: PrelockEntry) => {
    setData(prev => {
      if (!prev) return prev
      const next = { ...prev, prelocks: [...prev.prelocks, pl] }
      localStorage.setItem(storageKey(dept), JSON.stringify(next))
      return next
    })
  }, [dept])

  const removePrelock = useCallback((id: string) => {
    setData(prev => {
      if (!prev) return prev
      const next = { ...prev, prelocks: prev.prelocks.filter(p => p.id !== id) }
      localStorage.setItem(storageKey(dept), JSON.stringify(next))
      return next
    })
  }, [dept])

  const addOHCase = useCallback((opDay: number) => {
    setData(prev => {
      if (!prev) return prev
      const ohCase: OHCase = { id: `oh_${Date.now()}`, opDay }
      const next = { ...prev, ohCases: [...prev.ohCases, ohCase] }
      localStorage.setItem(storageKey(dept), JSON.stringify(next))
      return next
    })
  }, [dept])

  const removeOHCase = useCallback((id: string) => {
    setData(prev => {
      if (!prev) return prev
      const next = { ...prev, ohCases: prev.ohCases.filter(c => c.id !== id) }
      localStorage.setItem(storageKey(dept), JSON.stringify(next))
      return next
    })
  }, [dept])

  const autoSchedule = useCallback((): string[] => {
    let report: string[] = []
    setData(prev => {
      if (!prev) return prev
      const result = runAutoSchedule(
        { ...prev, carryover: prev.carryover, ohCases: prev.ohCases },
        prev.prelocks,
        prev.config,
      )
      report = result.report
      const next: ScheduleData = {
        ...prev,
        schedule: result.schedule as Record<string, ShiftCode>,
        warnings: result.warnings,
      }
      localStorage.setItem(storageKey(dept), JSON.stringify(next))
      return next
    })
    return report
  }, [dept])

  const clearSchedule = useCallback(() => {
    setData(prev => {
      if (!prev) return prev
      const next = { ...prev, schedule: {}, warnings: [] }
      localStorage.setItem(storageKey(dept), JSON.stringify(next))
      return next
    })
  }, [dept])

  const dismissWarning = useCallback((idx: number) => {
    setData(prev => {
      if (!prev) return prev
      const warnings = prev.warnings.filter((_, i) => i !== idx)
      const next = { ...prev, warnings }
      localStorage.setItem(storageKey(dept), JSON.stringify(next))
      return next
    })
  }, [dept])

  // ── Staff management ─────────────────────────────────────────
  const addNurse = useCallback((nurse: Omit<Nurse, 'id' | 'order'>) => {
    setData(prev => {
      if (!prev) return prev
      const maxOrder = Math.max(0, ...prev.nurses.filter(n => n.group === nurse.group).map(n => n.order ?? 0))
      const newNurse: Nurse = { ...nurse, id: `N${Date.now()}`, order: maxOrder + 1 }
      const next = { ...prev, nurses: [...prev.nurses, newNurse] }
      localStorage.setItem(storageKey(dept), JSON.stringify(next))
      return next
    })
  }, [dept])

  const updateNurse = useCallback((id: string, patch: Partial<Nurse>) => {
    setData(prev => {
      if (!prev) return prev
      const nurses = prev.nurses.map(n => n.id === id ? { ...n, ...patch } : n)
      const next = { ...prev, nurses }
      localStorage.setItem(storageKey(dept), JSON.stringify(next))
      return next
    })
  }, [dept])

  const removeNurse = useCallback((id: string) => {
    setData(prev => {
      if (!prev) return prev
      const nurses = prev.nurses.filter(n => n.id !== id)
      // clean up this nurse's schedule cells
      const schedule: Record<string, ShiftCode> = {}
      for (const [k, v] of Object.entries(prev.schedule)) {
        if (!k.startsWith(`${id}-`)) schedule[k] = v
      }
      const prelocks = prev.prelocks.filter(p => p.nurseId !== id)
      const next = { ...prev, nurses, schedule, prelocks }
      localStorage.setItem(storageKey(dept), JSON.stringify(next))
      return next
    })
  }, [dept])

  const toggleNurseActive = useCallback((id: string) => {
    setData(prev => {
      if (!prev) return prev
      const nurses = prev.nurses.map(n => n.id === id ? { ...n, active: !n.active } : n)
      const next = { ...prev, nurses }
      localStorage.setItem(storageKey(dept), JSON.stringify(next))
      return next
    })
  }, [dept])

  const monthLabel = data ? `${THAI_MONTHS[data.month - 1]} ${data.year + 543}` : ''

  return {
    data, setShift, changeMonth, updateConfig,
    addPrelock, removePrelock,
    addOHCase, removeOHCase,
    autoSchedule, clearSchedule, dismissWarning,
    addNurse, updateNurse, removeNurse, toggleNurseActive,
    monthLabel,
  }
}
