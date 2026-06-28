'use client'
import { useState, useEffect, useCallback } from 'react'
import type { Nurse } from './types'
import { getDefaultNurses } from './nurseDefaults'
import { THAI_MONTHS } from './constants'

export type ShiftCode = 'D' | 'N' | 'S' | 'CH' | 'O' | 'V' | 'T' | 'L' | ''

export interface ScheduleData {
  year: number    // CE
  month: number   // 1-12
  nurses: Nurse[]
  schedule: Record<string, ShiftCode>  // `${nurseId}-${day}` → shift
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
  return new Date(year, month - 1, day).getDay() // 0=Sun
}

export function isWeekend(year: number, month: number, day: number) {
  const d = getDow(year, month, day)
  return d === 0 || d === 6
}

export function thaiDow(year: number, month: number, day: number) {
  return THAI_DOW[getDow(year, month, day)]
}

export function cycleShift(current: ShiftCode): ShiftCode {
  const idx = SHIFT_CYCLE.indexOf(current)
  return SHIFT_CYCLE[(idx + 1) % SHIFT_CYCLE.length]
}

function storageKey(dept: string) {
  return `nurse_v4_${dept}`
}

function makeEmpty(dept: string): ScheduleData {
  const now = new Date()
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    nurses: getDefaultNurses(dept),
    schedule: {},
  }
}

export function useSchedule(dept: string) {
  const [data, setData] = useState<ScheduleData | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem(storageKey(dept))
    if (raw) {
      try { setData(JSON.parse(raw)); return } catch {}
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
    if (!data) return
    const key = storageKey(dept)
    const allRaw = localStorage.getItem(key + '_all')
    // save current
    const all: Record<string, Record<string, ShiftCode>> = allRaw ? JSON.parse(allRaw) : {}
    all[`${data.year}-${data.month}`] = data.schedule
    localStorage.setItem(key + '_all', JSON.stringify(all))
    // load target month
    const next: ScheduleData = {
      ...data,
      year,
      month,
      schedule: all[`${year}-${month}`] ?? {},
    }
    save(next)
  }, [data, dept, save])

  const monthLabel = data ? `${THAI_MONTHS[data.month - 1]} ${data.year + 543}` : ''

  return { data, setShift, changeMonth, monthLabel }
}
