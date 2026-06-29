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

export interface OHCase {
  id: string
  opDay: number
}

export interface WarningEntry {
  day?: number
  nurseId?: string
  type: 'senior_short' | 'coverage_short' | 'over_consec' | 'oh_short' | 'role_short' | 'over_cap'
  msg: string
  severity: 'crit' | 'warn'
}

export type RoleCode = 'I' | 'TL'

export interface ScheduleInput {
  year: number
  month: number
  nurses: Nurse[]
  schedule: Record<string, ShiftCode>
  carryover?: Record<string, ShiftCode>
  ohCases?: OHCase[]
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
const OH_CAPABLE = new Set(['CNS', 'RN4', 'RN3', 'CO'])
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

// ── MAIN ENGINE ───────────────────────────────────────────────────
export function runAutoSchedule(
  input: ScheduleInput,
  prelocks: PrelockEntry[] = [],
  cfg: AutoConfig = DEFAULT_CONFIG,
): { schedule: Sched; report: string[]; warnings: WarningEntry[]; roles: Record<string, RoleCode> } {
  const { year, month, nurses, carryover = {}, ohCases = [] } = input
  const days = daysInMonth(year, month)
  const sc: Sched = {}
  const warnings: WarningEntry[] = []

  // Pass 1: carry leaves from existing schedule
  for (const [k, v] of Object.entries(input.schedule)) {
    if (['V', 'T', 'L'].includes(v as string)) sc[k] = v as ShiftCode
  }

  // Pass 2: prelock map + apply
  const prelockMap: Record<string, Record<number, ShiftCode>> = {}
  for (const pl of prelocks) {
    if (!prelockMap[pl.nurseId]) prelockMap[pl.nurseId] = {}
    for (const d of pl.days) prelockMap[pl.nurseId][d] = pl.shift
  }
  const isPrelock = (nid: string, d: number) => !!prelockMap[nid]?.[d]

  for (const pl of prelocks) {
    for (const d of pl.days) {
      if (d >= 1 && d <= days) setS(sc, pl.nurseId, d, pl.shift)
    }
  }

  // hardOk closure — uses carryover for N→D boundary at d=1
  function hardOk(n: Nurse, d: number, shift: ShiftCode): boolean {
    if (isHOD(n)) return false
    if (isCo(n) && (shift === 'N' || shift === 'S')) return false
    if (n.day_only && (shift === 'N' || shift === 'S')) return false
    if (isCo(n) && shift === 'CH' && isWeekend(year, month, d)) return false
    const prevShift = d === 1 ? (carryover[n.id] ?? '') : getS(sc, n.id, d - 1)
    if ((shift === 'D' || shift === 'CH') && prevShift === 'N') return false
    if (shift === 'N' && (getS(sc, n.id, d + 1) === 'D' || getS(sc, n.id, d + 1) === 'CH')) return false
    if (consecWork(sc, n.id, d - 1) >= 6) return false
    return true
  }

  function avail(n: Nurse, d: number) {
    return !isPrelock(n.id, d) && !getS(sc, n.id, d)
  }

  const rnAll    = nurses.filter(n => n.active && n.group === 'RN')
  const rnCo     = rnAll.filter(isCo)
  const rnReg    = rnAll.filter(n => !isHOD(n) && !isCo(n))
  const rnDPool  = [...rnReg, ...rnCo]
  const rnSenior = rnAll.filter(n => SENIOR.has(n.position))
  const pnAll    = nurses.filter(n => n.active && n.group === 'PN')
  const pnReg    = pnAll.filter(n => !n.day_only)

  // OH boost: surgery day (Day0) + next day (Day1) need +1 RN on both D and N
  const ohBoostDays = new Set<number>()
  for (const c of ohCases) {
    for (const d of [c.opDay, c.opDay + 1]) {
      if (d >= 1 && d <= days) ohBoostDays.add(d)
    }
  }
  const effRnD = (d: number) => cfg.rnD + (ohBoostDays.has(d) ? 1 : 0)
  const effRnN = (d: number) => cfg.rnN + (ohBoostDays.has(d) ? 1 : 0)

  // Pass 3: Co-nurse weekends → O
  for (const n of rnCo) {
    for (let d = 1; d <= days; d++) {
      if (!avail(n, d)) continue
      if (isWeekend(year, month, d)) setS(sc, n.id, d, 'O')
    }
  }

  const rnNTarget = (cfg.rnN * days) / Math.max(1, rnReg.length)
  const pnNTarget = (cfg.pnN * days) / Math.max(1, pnReg.length)

  // Pass 4-7: Sequential day fill
  for (let d = 1; d <= days; d++) {
    // RN-D
    let curRnD = countOnDay(sc, rnDPool, d, 'D')
    if (curRnD < effRnD(d)) {
      const cands = rnDPool.filter(n => avail(n, d) && hardOk(n, d, 'D'))
        .sort((a, b) => {
          const sa = consecWork(sc, a.id, d - 1), sb = consecWork(sc, b.id, d - 1)
          return sa !== sb ? sa - sb : workCount(sc, a.id, days) - workCount(sc, b.id, days)
        })
      for (const n of cands) {
        if (curRnD >= effRnD(d)) break
        setS(sc, n.id, d, 'D'); curRnD++
      }
    }

    // RN-N
    let curRnN = countOnDay(sc, rnReg, d, 'N')
    if (curRnN < effRnN(d)) {
      const cands = rnReg.filter(n => avail(n, d) && hardOk(n, d, 'N') && workCount(sc, n.id, days) < cfg.workDaysMax)
        .sort((a, b) => {
          const defA = rnNTarget - shiftCount(sc, a.id, 'N', days)
          const defB = rnNTarget - shiftCount(sc, b.id, 'N', days)
          return defA !== defB ? defB - defA : consecWork(sc, b.id, d - 1) - consecWork(sc, a.id, d - 1)
        })
      for (const n of cands) {
        if (curRnN >= effRnN(d)) break
        setS(sc, n.id, d, 'N'); curRnN++
      }
    }

    // PN-D
    let curPnD = countOnDay(sc, pnAll, d, 'D')
    if (curPnD < cfg.pnD) {
      const cands = pnAll.filter(n => avail(n, d) && hardOk(n, d, 'D'))
        .sort((a, b) => workCount(sc, a.id, days) - workCount(sc, b.id, days))
      for (const n of cands) {
        if (curPnD >= cfg.pnD) break
        setS(sc, n.id, d, 'D'); curPnD++
      }
    }

    // PN-N
    let curPnN = countOnDay(sc, pnReg, d, 'N')
    if (curPnN < cfg.pnN) {
      const cands = pnReg.filter(n => avail(n, d) && hardOk(n, d, 'N') && workCount(sc, n.id, days) < cfg.workDaysMax)
        .sort((a, b) => {
          const defA = pnNTarget - shiftCount(sc, a.id, 'N', days)
          const defB = pnNTarget - shiftCount(sc, b.id, 'N', days)
          return defA !== defB ? defB - defA : consecWork(sc, b.id, d - 1) - consecWork(sc, a.id, d - 1)
        })
      for (const n of cands) {
        if (curPnN >= cfg.pnN) break
        setS(sc, n.id, d, 'N'); curPnN++
      }
    }
  }

  // Pass 8: OH Coverage (CCU only — when ohCases provided)
  for (const ohCase of ohCases) {
    const { opDay } = ohCase
    const ohReqs: Array<{ d: number; minOH: number }> = [
      { d: opDay,     minOH: 2 },
      { d: opDay + 1, minOH: 1 },
    ].filter(r => r.d >= 1 && r.d <= days)

    for (const { d, minOH } of ohReqs) {
      for (const shift of ['D', 'N'] as ShiftCode[]) {
        const onShift     = rnAll.filter(n => getS(sc, n.id, d) === shift)
        const ohOnShift   = onShift.filter(n => OH_CAPABLE.has(n.position))
        const needed      = minOH - ohOnShift.length
        if (needed <= 0) continue

        // OH-capable nurses currently on O who can take this shift
        const ohCands = rnAll.filter(n =>
          OH_CAPABLE.has(n.position) &&
          getS(sc, n.id, d) === 'O' &&
          !isPrelock(n.id, d) &&
          hardOk(n, d, shift),
        )

        const swapCount = Math.min(needed, ohCands.length)
        for (let i = 0; i < swapCount; i++) {
          const cand = ohCands[i]
          // kick a non-OH nurse from the shift slot (keep quota balanced)
          const nonOH = onShift.filter(n => !OH_CAPABLE.has(n.position) && !isPrelock(n.id, d))
          if (nonOH.length > 0) {
            setS(sc, nonOH[nonOH.length - 1].id, d, 'O')
            onShift.splice(onShift.indexOf(nonOH[nonOH.length - 1]), 1)
          }
          setS(sc, cand.id, d, shift)
          onShift.push(cand)
        }

        if (swapCount < needed) {
          warnings.push({
            day: d,
            type: 'oh_short',
            msg: `OH Day${d - opDay} (${d}) เวร ${shift}: OH-capable ขาด (ได้ ${ohOnShift.length + swapCount}/${minOH})`,
            severity: 'crit',
          })
        }
      }
    }
  }

  // Pass 9: Senior coverage fix — each D/N shift must have ≥1 senior
  for (let d = 1; d <= days; d++) {
    for (const shift of ['D', 'N'] as ShiftCode[]) {
      const onShift  = rnAll.filter(n => getS(sc, n.id, d) === shift)
      if (onShift.length === 0) continue
      const hasSenior = onShift.some(n => SENIOR.has(n.position))
      if (hasSenior) continue

      // find senior on O who can take this shift
      const seniorCands = rnSenior.filter(n =>
        getS(sc, n.id, d) === 'O' &&
        !isPrelock(n.id, d) &&
        hardOk(n, d, shift),
      )
      if (seniorCands.length > 0) {
        const senior = seniorCands[0]
        // kick last non-senior from shift → O to keep quota
        const nonSeniors = onShift.filter(n => !SENIOR.has(n.position) && !isPrelock(n.id, d))
        if (nonSeniors.length > 0) {
          setS(sc, nonSeniors[nonSeniors.length - 1].id, d, 'O')
        }
        setS(sc, senior.id, d, shift)
      } else {
        warnings.push({
          day: d,
          type: 'senior_short',
          msg: `วันที่ ${d} เวร ${shift}: ไม่มี Senior (CNS/RN3+)`,
          severity: 'warn',
        })
      }
    }
  }

  // Pass 7.5: Co-nurse weekday fill → ช or D
  for (const n of rnCo) {
    for (let d = 1; d <= days; d++) {
      if (!avail(n, d)) continue
      if (isWeekend(year, month, d)) { setS(sc, n.id, d, 'O'); continue }
      const curD = countOnDay(sc, rnDPool, d, 'D')
      setS(sc, n.id, d, curD >= effRnD(d) ? 'CH' : 'D')
    }
  }

  // Pass 11: Fill rest → O
  for (const n of [...rnAll, ...pnAll]) {
    if (isHOD(n)) continue
    for (let d = 1; d <= days; d++) {
      if (!getS(sc, n.id, d)) setS(sc, n.id, d, 'O')
    }
  }

  // Pass 15: Balance — boost under-target nurses
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
        const shift: ShiftCode = countOnDay(sc, rnDPool, d, 'D') < effRnD(d) ? 'D' : 'N'
        if (!hardOk(u, d, shift)) continue
        setS(sc, u.id, d, shift)
      }
    }
  }

  // Pass 13.5: Fill D & N to target on EVERY day (coverage priority)
  //   phase 1 → candidates under the work-day cap
  //   phase 2 → allow exceeding cap so N=4/D=4 is guaranteed (Hard Rules still enforced via hardOk)
  for (let d = 1; d <= days; d++) {
    for (const shift of ['D', 'N'] as ShiftCode[]) {
      const pool   = shift === 'D' ? rnDPool : rnReg
      const target = shift === 'D' ? effRnD(d) : effRnN(d)
      let cur = countOnDay(sc, pool, d, shift)
      if (cur >= target) continue
      for (const allowOverCap of [false, true]) {
        if (cur >= target) break
        const cands = pool.filter(n =>
          getS(sc, n.id, d) === 'O' &&
          !isPrelock(n.id, d) &&
          hardOk(n, d, shift) &&
          (allowOverCap || workCount(sc, n.id, days) < cfg.workDaysMax),
        ).sort((a, b) => {
          const sa = shiftCount(sc, a.id, shift, days), sb = shiftCount(sc, b.id, shift, days)
          return sa !== sb ? sa - sb : workCount(sc, a.id, days) - workCount(sc, b.id, days)
        })
        for (const n of cands) {
          if (cur >= target) break
          setS(sc, n.id, d, shift); cur++
        }
      }
    }
  }

  // Pass 14: N-balance swap — equalize N-shift distribution
  const nWorkers = [...rnReg, ...pnReg]
  for (let iter = 0; iter < 3; iter++) {
    const nCounts = new Map(nWorkers.map(n => [n.id, shiftCount(sc, n.id, 'N', days)]))
    const sorted  = [...nWorkers].sort((a, b) => (nCounts.get(b.id) ?? 0) - (nCounts.get(a.id) ?? 0))
    let swapped = false
    outer:
    for (let hi = 0; hi < sorted.length - 1; hi++) {
      for (let lo = sorted.length - 1; lo > hi; lo--) {
        const hiN = nCounts.get(sorted[hi].id) ?? 0
        const loN = nCounts.get(sorted[lo].id) ?? 0
        if (hiN - loN <= 2) break outer
        const hiNurse = sorted[hi]
        const loNurse = sorted[lo]
        for (let d = 1; d <= days; d++) {
          if (getS(sc, hiNurse.id, d) !== 'N') continue
          if (getS(sc, loNurse.id, d) !== 'O') continue
          if (isPrelock(hiNurse.id, d) || isPrelock(loNurse.id, d)) continue
          if (!hardOk(loNurse, d, 'N')) continue
          setS(sc, hiNurse.id, d, 'O')
          setS(sc, loNurse.id, d, 'N')
          nCounts.set(hiNurse.id, hiN - 1)
          nCounts.set(loNurse.id, loN + 1)
          swapped = true
          break
        }
        if (swapped) break outer
      }
    }
    if (!swapped) break
  }

  // Pass 10: assign Incharge (I) + Team Lead (TL) per shift
  const canI  = new Set(['CNS', 'RN4', 'RN3', 'CO'])
  const canTL = new Set(['CNS', 'RN4', 'RN3', 'RN2', 'CO'])
  const roles: Record<string, RoleCode> = {}
  for (let d = 1; d <= days; d++) {
    for (const shift of ['D', 'N'] as ShiftCode[]) {
      const onShift = rnAll.filter(n => getS(sc, n.id, d) === shift)
      if (onShift.length === 0) continue
      const iCand = onShift.find(n => canI.has(n.position))
      if (iCand) roles[`${iCand.id}-${d}`] = 'I'
      // Team Lead: a different nurse, prefer RN2 so seniors stay as Incharge
      const tlCand = onShift.find(n => n.id !== iCand?.id && n.position === 'RN2')
                  ?? onShift.find(n => n.id !== iCand?.id && canTL.has(n.position))
      if (tlCand) roles[`${tlCand.id}-${d}`] = 'TL'
      if (!iCand)  warnings.push({ day: d, type: 'role_short', msg: `วันที่ ${d} เวร ${shift}: ไม่มี Incharge (I)`, severity: 'warn' })
      if (!tlCand) warnings.push({ day: d, type: 'role_short', msg: `วันที่ ${d} เวร ${shift}: ไม่มี Team Lead (TL)`, severity: 'warn' })
    }
  }

  // ── Generate warnings for final state ─────────────────────────
  // Coverage shortages
  for (let d = 1; d <= days; d++) {
    const rnDCount = countOnDay(sc, rnDPool, d, 'D')
    const rnNCount = countOnDay(sc, rnReg,   d, 'N')
    const oh = ohBoostDays.has(d) ? ' (OH+1)' : ''
    if (rnDCount < effRnD(d)) {
      warnings.push({ day: d, type: 'coverage_short', msg: `วันที่ ${d} D: RN ขาด (${rnDCount}/${effRnD(d)})${oh}`, severity: 'crit' })
    }
    if (rnNCount < effRnN(d)) {
      warnings.push({ day: d, type: 'coverage_short', msg: `วันที่ ${d} N: RN ขาด (${rnNCount}/${effRnN(d)})${oh}`, severity: 'warn' })
    }
  }

  // Over-consecutive (> 6 days)
  for (const n of allWorkers) {
    for (let d = 7; d <= days; d++) {
      if (consecWork(sc, n.id, d) > 6) {
        warnings.push({
          day: d, nurseId: n.id,
          type: 'over_consec',
          msg: `${n.name.split(' ')[0]}: ทำติดกัน > 6 วัน (สิ้นสุดวันที่ ${d})`,
          severity: 'warn',
        })
        break
      }
    }
  }

  // Over-cap (> workDaysMax) — เกิดจากการการันตี N/D coverage → ต้อง Approve
  for (const n of allWorkers) {
    const wc = workCount(sc, n.id, days)
    if (wc > cfg.workDaysMax) {
      warnings.push({
        nurseId: n.id,
        type: 'over_cap',
        msg: `${n.name.split(' ')[0]}: ทำงาน ${wc} วัน (เกิน ${cfg.workDaysMax}) ⚠ ต้อง Approve`,
        severity: 'crit',
      })
    }
  }

  // ── Report ─────────────────────────────────────────────────────
  const report: string[] = []
  const over   = allWorkers.filter(n => workCount(sc, n.id, days) > cfg.workDaysMax)
  const under2 = allWorkers.filter(n => workCount(sc, n.id, days) < cfg.workDaysMin)
  if (over.length)   report.push(`⚠ เกิน ${cfg.workDaysMax} วัน: ${over.map(n => n.name.split(' ')[0]).join(', ')}`)
  if (under2.length) report.push(`⚠ ต่ำกว่า ${cfg.workDaysMin} วัน: ${under2.map(n => n.name.split(' ')[0]).join(', ')}`)
  if (!over.length && !under2.length) {
    const wc = warnings.filter(w => w.severity === 'crit').length
    report.push(wc > 0 ? `✓ จัดเสร็จ — มี ${wc} คำเตือนสำคัญ` : '✓ จัดเสร็จ — ทุกคนอยู่ในเป้าหมาย')
  }

  return { schedule: sc, report, warnings, roles }
}
