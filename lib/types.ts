export type Department = 'CCU' | 'NCU' | 'ICU' | 'W5A' | 'W6A' | 'W6B' | 'W7A' | 'W8A' | 'W9A' | 'W10A' | 'W11A' | 'W12A'
export type NurseGroup = 'RN' | 'PN'
export type ShiftType = 'D' | 'N' | 'S' | 'CH' | 'O' | 'V' | 'T' | 'L'
export type NursePosition = 'HOD' | 'CNS' | 'RN4' | 'RN3' | 'RN2' | 'RN1' | 'RN0' | 'CO' | 'PN' | 'WC'

export interface Nurse {
  id: string
  name: string
  nickname: string
  position: NursePosition
  group: NurseGroup
  department: Department
  emp_code: string
  phone: string
  start_date: string
  active: boolean
  day_only: boolean
  sort_order: number
  created_at?: string
}

export interface Schedule {
  id: string
  nurse_id: string
  department: Department
  year: number
  month: number
  day: number
  shift: ShiftType | null
  leave_type: 'V' | 'T' | 'L' | null
  is_pinned: boolean
  role: 'I' | 'TL' | null
  created_at?: string
  updated_at?: string
}

export interface Prelock {
  id: string
  nurse_id: string
  department: Department
  year: number
  month: number
  requested_days: number[]
  assigned_days: number[]
  shift_type: ShiftType
  tier: 1 | 2
  queue: number
  status: 'pending' | 'assigned'
  reason: string
  created_at?: string
}

export interface OHCase {
  id: string
  department: Department
  year: number
  month: number
  op_day: number
  created_at?: string
}

export interface SpecialDuty {
  id: string
  nurse_id: string
  department: Department
  year: number
  month: number
  day: number
  duty_name: string
  created_at?: string
}

export interface Warning {
  id: string
  department: Department
  year: number
  month: number
  day: number
  nurse_id: string | null
  type: string
  message: string
  severity: 'crit' | 'warn'
  approved: boolean
  approved_by: string | null
  reason: string | null
  created_at?: string
}

export interface DeptConfig {
  id: Department
  name: string
  fullName: string
  type: 'ICU' | 'WARD'
  beds: number
  hasOH: boolean
}
