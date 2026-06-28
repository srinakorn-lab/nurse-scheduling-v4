'use client'
import { useState, useEffect, useCallback } from 'react'
import type { Nurse } from './types'
import { getDefaultNurses } from './nurseDefaults'
import { THAI_MONTHS } from './constants'
import { runAutoSchedule, DEFAULT_CONFIG } from './autoSchedule'
import type { AutoConfig, PrelockEntry, ShiftCode } from './autoSchedule'

export type { ShiftCode, PrelockEntry, AutoConfig }

export interface ScheduleData {
  year: number
  month: number
  nurses: Nurse[]
  schedule: Record<string, ShiftCode>
  prelocks: PrelockEntry[]
  config: AutoConfig
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
    config: { ...DEFAULT_CONFIG },
  }
}

export function useSchedule(dept: string) {
  const [data, setData] = useState<ScheduleData | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem(storageKey(dept))
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        // backfill new fields
        if (!parsed.prelocks) parsed.prelocks = []
        if (!parsed.config)   parsed.config = { ...DEFAULT_CONFIG }
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
      // save current month's schedule
      const key = storageKey(dept) + '_all'
      const allRaw = localStorage.getItem(key)
      const all: Record<string, Record<string, ShiftCode>> = allRaw ? JSON.parse(allRaw) : {}
      all[`${prev.year}-${prev.month}`] = prev.schedule
      localStorage.setItem(key, JSON.stringify(all))
      // load or empty new month
      const next: ScheduleData = {
        ...prev, year, month,
        schedule: all[`${year}-${month}`] ?? {},
        prelocks: [],
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

  const autoSchedule = useCallback((): string[] => {
    let report: string[] = []
    setData(prev => {
      if (!prev) return prev
      const result = runAutoSchedule(prev, prev.prelocks, prev.config)
      report = result.report
      const next = { ...prev, schedule: result.schedule as Record<string, ShiftCode> }
      localStorage.setItem(storageKey(dept), JSON.stringify(next))
      return next
    })
    return report
  }, [dept])

  const clearSchedule = useCallback(() => {
    setData(prev => {
      if (!prev) return prev
      const next = { ...prev, schedule: {} }
      localStorage.setItem(storageKey(dept), JSON.stringify(next))
      return next
    })
  }, [dept])

  const monthLabel = data ? `${THAI_MONTHS[data.month - 1]} ${data.year + 543}` : ''

  return { data, setShift, changeMonth, updateConfig, addPrelock, removePrelock, autoSchedule, clearSchedule, monthLabel }
}
