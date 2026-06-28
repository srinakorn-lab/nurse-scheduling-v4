import type { Nurse } from './types'

export type ShiftCode = 'D' | 'N' | 'S' | 'CH' | 'O' | 'V' | 'T' | 'L' | ''

export interface PrelockEntry {
  id: string
  nurseId: string
  days: number[]
  shift: ShiftCode
  note?: string
}

export interface AutoConfig {
  rnD: number
  rnN: number
  pnD: number
  pnN: number
  workDaysMin: number
  workDaysMax: number
  tgtOff: number
}

export const DEFAULT_CONFIG: AutoConfig = {
  rnD: 4, rnN: 4,
  pnD: 3, pnN: 3,
  workDaysMin: 21, workDaysMax: 23,
  tgtOff: 8,
}

export interface ScheduleInput {
  year: number
  month: number
  nurses: Nurse[]
  schedule: Record<string, ShiftCode>
}

// ── helpers ───────────────────────────────────────────────────────
function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate()
}
function dow(year: number, month: number, d: number) {
  return new Date(year, month - 1, d).getDay()
}
function isWeekend(year: number, month: number, d: number) {
  const w = dow(year, month, d); return w === 0 || w === 6
}

const SENIOR = new Set(['CNS', 'RN4', 'RN3'])
function isHOD(n: Nurse) { return n.position === 'HOD' }
function isCo(n: Nurse)  { return n.position === 'CO' }

type Sched = Record<string, ShiftCode>

function getS(sc: Sched, nid: string, d: number): ShiftCode {
  return sc[`${nid}-${d}`] ?? ''
}
function setS(sc: Sched, nid: string, d: number, s: ShiftCode) {
  sc[`${nid}-${d}`] = s
}

function workCount(sc: Sched, nid: string, days: number) {
  let c = 0
  for (let d = 1; d <= days; d++) {
    const s = getS(sc, nid, d)
    if (['D', 'N', 'S', 'CH'].includes(s)) c++
  }
  return c
}

function consecWork(sc: Sched, nid: string, upToDay: number): number {
  let c = 0
  for (let d = upToDay; d >= 1; d--) {
    const s = getS(sc, nid, d)
    if (['D', 'N', 'S', 'CH', 'V', 'T', 'L'].includes(s)) c++
    else break
  }
  return c
}

function shiftCount(sc: Sched, nid: string, shift: ShiftCode, days: number) {
  let c = 0
  for (let d = 1; d <= days; d++) if (getS(sc, nid, d) === shift) c++
  return c
}

function countOnDay(sc: Sched, nurses: Nurse[], d: number, shift: ShiftCode) {
  return nurses.filter(n => getS(sc, n.id, d) === shift).length
}

function hardOk(sc: Sched, n: Nurse, d: number, shift: ShiftCode, year: number, month: number): boolean {
  if (isHOD(n)) return false
  if (isCo(n) && (shift === 'N' || shift === 'S')) return false
  if (n.day_only && (shift === 'N' || shift === 'S')) return false
  if (isCo(n) && shift === 'CH' && isWeekend(year, month, d)) return false
  if ((shift === 'D' || shift === 'CH') && getS(sc, n.id, d - 1) === 'N') return false
  if (shift === 'N' && (getS(sc, n.id, d + 1) === 'D' || getS(sc, n.id, d + 1) === 'CH')) return false
  if (consecWork(sc, n.id, d - 1) >= 6) return false
  return true
}

// ── MAIN ENGINE ───────────────────────────────────────────────────
export function runAutoSchedule(
  input: ScheduleInput,
  prelocks: PrelockEntry[] = [],
  cfg: AutoConfig = DEFAULT_CONFIG,
): { schedule: Sched; report: string[] } {
  const { year, month, nurses } = input
  const days = daysInMonth(year, month)
  const sc: Sched = {}

  // carry leaves from existing schedule
  for (const [k, v] of Object.entries(input.schedule)) {
    if (['V', 'T', 'L'].includes(v as string)) sc[k] = v as ShiftCode
  }

  // prelockMap
  const prelockMap: Record<string, Record<number, ShiftCode>> = {}
  for (const pl of prelocks) {
    if (!prelockMap[pl.nurseId]) prelockMap[pl.nurseId] = {}
    for (const d of pl.days) prelockMap[pl.nurseId][d] = pl.shift
  }
  const isPrelock = (nid: string, d: number) => !!prelockMap[nid]?.[d]

  // Apply prelocks
  for (const pl of prelocks) {
    for (const d of pl.days) {
      if (d >= 1 && d <= days) setS(sc, pl.nurseId, d, pl.shift)
    }
  }

  function avail(n: Nurse, d: number) {
    return !isPrelock(n.id, d) && !getS(sc, n.id, d)
  }
  function ok(n: Nurse, d: number, shift: ShiftCode) {
    return hardOk(sc, n, d, shift, year, month)
  }

  const rnAll  = nurses.filter(n => n.active && n.group === 'RN')
  const rnCo   = rnAll.filter(isCo)
  const rnReg  = rnAll.filter(n => !isHOD(n) && !isCo(n))
  const rnDPool = [...rnReg, ...rnCo]
  const pnAll  = nurses.filter(n => n.active && n.group === 'PN')
  const pnReg  = pnAll.filter(n => !n.day_only)

  // Co-nurse weekends → O
  for (const n of rnCo) {
    for (let d = 1; d <= days; d++) {
      if (!avail(n, d)) continue
      if (isWeekend(year, month, d)) setS(sc, n.id, d, 'O')
    }
  }

  const rnNTarget = (cfg.rnN * days) / Math.max(1, rnReg.length)
  const pnNTarget = (cfg.pnN * days) / Math.max(1, pnReg.length)

  // Sequential day fill
  for (let d = 1; d <= days; d++) {
    // RN-D
    let curRnD = countOnDay(sc, rnDPool, d, 'D')
    if (curRnD < cfg.rnD) {
      const cands = rnDPool.filter(n => avail(n, d) && ok(n, d, 'D'))
        .sort((a, b) => {
          const sa = consecWork(sc, a.id, d - 1), sb = consecWork(sc, b.id, d - 1)
          return sa !== sb ? sa - sb : workCount(sc, a.id, days) - workCount(sc, b.id, days)
        })
      for (const n of cands) {
        if (curRnD >= cfg.rnD) break
        setS(sc, n.id, d, 'D'); curRnD++
      }
    }

    // RN-N
    let curRnN = countOnDay(sc, rnReg, d, 'N')
    if (curRnN < cfg.rnN) {
      const cands = rnReg.filter(n => avail(n, d) && ok(n, d, 'N') && workCount(sc, n.id, days) < cfg.workDaysMax)
        .sort((a, b) => {
          const defA = rnNTarget - shiftCount(sc, a.id, 'N', days)
          const defB = rnNTarget - shiftCount(sc, b.id, 'N', days)
          return Math.abs(defA - defB) > 1 ? defB - defA
            : consecWork(sc, b.id, d - 1) - consecWork(sc, a.id, d - 1)
        })
      for (const n of cands) {
        if (curRnN >= cfg.rnN) break
        setS(sc, n.id, d, 'N'); curRnN++
      }
    }

    // PN-D
    let curPnD = countOnDay(sc, pnAll, d, 'D')
    if (curPnD < cfg.pnD) {
      const cands = pnAll.filter(n => avail(n, d) && ok(n, d, 'D'))
        .sort((a, b) => workCount(sc, a.id, days) - workCount(sc, b.id, days))
      for (const n of cands) {
        if (curPnD >= cfg.pnD) break
        setS(sc, n.id, d, 'D'); curPnD++
      }
    }

    // PN-N
    let curPnN = countOnDay(sc, pnReg, d, 'N')
    if (curPnN < cfg.pnN) {
      const cands = pnReg.filter(n => avail(n, d) && ok(n, d, 'N') && workCount(sc, n.id, days) < cfg.workDaysMax)
        .sort((a, b) => {
          const defA = pnNTarget - shiftCount(sc, a.id, 'N', days)
          const defB = pnNTarget - shiftCount(sc, b.id, 'N', days)
          return Math.abs(defA - defB) > 1 ? defB - defA
            : consecWork(sc, b.id, d - 1) - consecWork(sc, a.id, d - 1)
        })
      for (const n of cands) {
        if (curPnN >= cfg.pnN) break
        setS(sc, n.id, d, 'N'); curPnN++
      }
    }
  }

  // Co-nurse weekday fill → ช or D
  for (const n of rnCo) {
    for (let d = 1; d <= days; d++) {
      if (!avail(n, d)) continue
      if (isWeekend(year, month, d)) { setS(sc, n.id, d, 'O'); continue }
      const curD = countOnDay(sc, rnDPool, d, 'D')
      setS(sc, n.id, d, curD >= cfg.rnD ? 'CH' : 'D')
    }
  }

  // Fill rest → O
  for (const n of [...rnAll, ...pnAll]) {
    if (isHOD(n)) continue
    for (let d = 1; d <= days; d++) {
      if (!getS(sc, n.id, d)) setS(sc, n.id, d, 'O')
    }
  }

  // Balance: boost under-target nurses
  const allWorkers = [...rnReg, ...rnCo, ...pnAll]
  for (let iter = 0; iter < 4; iter++) {
    const under = allWorkers
      .filter(n => workCount(sc, n.id, days) < cfg.workDaysMin)
      .sort((a, b) => workCount(sc, a.id, days) - workCount(sc, b.id, days))
    if (!under.length) break
    for (const u of under) {
      for (let d = 1; d <= days; d++) {
        if (workCount(sc, u.id, days) >= cfg.workDaysMin) break
        if (getS(sc, u.id, d) !== 'O') continue
        const shift: ShiftCode = countOnDay(sc, rnDPool, d, 'D') < cfg.rnD ? 'D' : 'N'
        if (!ok(u, d, shift)) continue
        setS(sc, u.id, d, shift)
      }
    }
  }

  // Report
  const report: string[] = []
  const over  = allWorkers.filter(n => workCount(sc, n.id, days) > cfg.workDaysMax)
  const under2 = allWorkers.filter(n => workCount(sc, n.id, days) < cfg.workDaysMin)
  if (over.length)   report.push(`⚠ เกิน ${cfg.workDaysMax} วัน: ${over.map(n => n.name.split(' ')[0]).join(', ')}`)
  if (under2.length) report.push(`⚠ ต่ำกว่า ${cfg.workDaysMin} วัน: ${under2.map(n => n.name.split(' ')[0]).join(', ')}`)
  if (!over.length && !under2.length) report.push('✓ จัดเสร็จ — ทุกคนอยู่ในเป้าหมาย')

  return { schedule: sc, report }
}
