import type { DeptConfig, ShiftType, NursePosition, NurseGroup } from './types'

export const POSITIONS: { value: NursePosition; label: string; icon: string; group: NurseGroup }[] = [
  { value: 'CNS', label: 'CNS',        icon: '⭐', group: 'RN' },
  { value: 'RN4', label: 'RN4',        icon: '🔵', group: 'RN' },
  { value: 'RN3', label: 'RN3',        icon: '🔵', group: 'RN' },
  { value: 'RN2', label: 'RN2',        icon: '🟦', group: 'RN' },
  { value: 'RN1', label: 'RN1',        icon: '⬜', group: 'RN' },
  { value: 'RN0', label: 'RN0',        icon: '⬜', group: 'RN' },
  { value: 'CO',  label: 'Co-nurse',   icon: '🟢', group: 'RN' },
  { value: 'PN',  label: 'PN',         icon: '🟠', group: 'PN' },
  { value: 'WC',  label: 'ผู้ช่วย WC', icon: '🌸', group: 'PN' },
]

export const DEPT_LIST: DeptConfig[] = [
  { id: 'CCU', name: 'CCU', fullName: 'วิกฤตหัวใจ',   type: 'ICU',  beds: 6,  hasOH: true  },
  { id: 'NCU', name: 'NCU', fullName: 'วิกฤตประสาท',  type: 'ICU',  beds: 4,  hasOH: false },
  { id: 'ICU', name: 'ICU', fullName: 'วิกฤตทั่วไป',  type: 'ICU',  beds: 8,  hasOH: false },
  { id: 'W5A', name: 'W.5A', fullName: 'OBS DayCase', type: 'WARD', beds: 15, hasOH: false },
  { id: 'W6A', name: 'W.6A', fullName: 'อายุรกรรม',   type: 'WARD', beds: 26, hasOH: false },
  { id: 'W6B', name: 'W.6B', fullName: 'ศัลยกรรม',    type: 'WARD', beds: 36, hasOH: false },
  { id: 'W7A', name: 'W.7A', fullName: 'อายุรกรรม',   type: 'WARD', beds: 21, hasOH: false },
  { id: 'W8A', name: 'W.8A', fullName: 'ศัลยกรรม',    type: 'WARD', beds: 27, hasOH: false },
  { id: 'W9A', name: 'W.9A', fullName: 'อายุรกรรม',   type: 'WARD', beds: 23, hasOH: false },
  { id: 'W10A', name: 'W.10A', fullName: 'อายุรกรรม', type: 'WARD', beds: 25, hasOH: false },
  { id: 'W11A', name: 'W.11A', fullName: 'อายุรกรรม', type: 'WARD', beds: 12, hasOH: false },
  { id: 'W12A', name: 'W.12A', fullName: 'อายุรกรรม', type: 'WARD', beds: 24, hasOH: false },
]

export const SHIFT_CONFIG: Record<ShiftType, { label: string; hours: number; color: string; bg: string }> = {
  D:  { label: 'D',  hours: 11, color: '#1e40af', bg: '#dbeafe' },
  N:  { label: 'N',  hours: 11, color: '#4c1d95', bg: '#ede9fe' },
  S:  { label: 'S',  hours: 15, color: '#92400e', bg: '#fef3c7' },
  CH: { label: 'ช',  hours: 9,  color: '#065f46', bg: '#d1fae5' },
  O:  { label: 'O',  hours: 0,  color: '#6b7280', bg: '#f3f4f6' },
  V:  { label: 'V',  hours: 11, color: '#0369a1', bg: '#e0f2fe' },
  T:  { label: 'T',  hours: 11, color: '#0369a1', bg: '#e0f2fe' },
  L:  { label: 'L',  hours: 11, color: '#7c3aed', bg: '#f5f3ff' },
}

export const THAI_MONTHS = [
  'มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน',
  'กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม',
]

export const THAI_MONTHS_SHORT = [
  'ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.',
  'ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.',
]

export const FIXED_HOLIDAYS: Record<string, string> = {
  '1-1': 'วันขึ้นปีใหม่', '4-6': 'วันจักรี', '4-13': 'วันสงกรานต์',
  '4-14': 'วันสงกรานต์', '4-15': 'วันสงกรานต์', '5-1': 'วันแรงงาน',
  '5-4': 'วันฉัตรมงคล', '6-3': 'วันเฉลิมพระชนมพรรษา ร.10 (ทรงสละ)',
  '7-28': 'วันเฉลิมพระชนมพรรษา ร.10', '8-12': 'วันแม่แห่งชาติ',
  '10-13': 'วันสวรรคต ร.9', '10-23': 'วันปิยมหาราช',
  '12-5': 'วันพ่อแห่งชาติ', '12-10': 'วันรัฐธรรมนูญ', '12-31': 'วันสิ้นปี',
}
