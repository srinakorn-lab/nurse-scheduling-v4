// คำนวณ level (RN1/RN2/RN3) จากวันเริ่มงาน สำหรับ IPD ward
// กติกา: อายุงาน < 2 ปี = level 1, 2–4 ปี = level 2, > 4 ปี = level 3

import type { NursePosition } from './types'

const THAI_MONTH_ABBR: Record<string, number> = {
  'ม.ค.': 1, 'มกราคม': 1,
  'ก.พ.': 2, 'กุมภาพันธ์': 2,
  'มี.ค.': 3, 'มีนาคม': 3,
  'เม.ย.': 4, 'เมษายน': 4,
  'พ.ค.': 5, 'พฤษภาคม': 5,
  'มิ.ย.': 6, 'มิถุนายน': 6,
  'ก.ค.': 7, 'กรกฎาคม': 7,
  'ส.ค.': 8, 'สิงหาคม': 8,
  'ก.ย.': 9, 'กันยายน': 9,
  'ต.ค.': 10, 'ตุลาคม': 10,
  'พ.ย.': 11, 'พฤศจิกายน': 11,
  'ธ.ค.': 12, 'ธันวาคม': 12,
}

/** ดึงปี พ.ศ. จากสตริงวันเริ่มงาน เช่น "1 ก.ค.2567", "16 พ.ค.60", "2564", "1/7/2556" */
export function parseBEYear(input: string): number | null {
  if (!input) return null
  const s = input.trim()
  // หาเลข 4 หลัก (25xx) ก่อน
  const m4 = s.match(/25\d{2}/)
  if (m4) return parseInt(m4[0], 10)
  // เลข 2 หลักท้าย เช่น "60" → 2560
  const nums = s.match(/\d{1,4}/g)
  if (nums && nums.length) {
    const last = nums[nums.length - 1]
    if (last.length === 2) return 2500 + parseInt(last, 10)
    if (last.length === 4) return parseInt(last, 10)
  }
  return null
}

/** ดึงเดือน (1–12) จากสตริง เพื่อคำนวณอายุงานแม่นระดับเดือน (ถ้าอ่านได้) */
function parseBEMonth(input: string): number | null {
  for (const [abbr, num] of Object.entries(THAI_MONTH_ABBR)) {
    if (input.includes(abbr)) return num
  }
  const slash = input.match(/(\d{1,2})\/(\d{1,2})\/\d{2,4}/)
  if (slash) return parseInt(slash[2], 10)
  return null
}

/** อายุงาน (ปี, ทศนิยม) ณ วันอ้างอิง (ค่าเริ่มต้น ก.ค. 2569) */
export function yearsOfService(startDate: string, refYearBE = 2569, refMonth = 7): number | null {
  const y = parseBEYear(startDate)
  if (y == null) return null
  const m = parseBEMonth(startDate) ?? 1
  return (refYearBE - y) + (refMonth - m) / 12
}

/** RN level position จากวันเริ่มงาน — สำหรับ IPD ward */
export function rnLevelFromStartDate(startDate: string, refYearBE = 2569, refMonth = 7): NursePosition | null {
  const yrs = yearsOfService(startDate, refYearBE, refMonth)
  if (yrs == null) return null
  if (yrs < 2) return 'RN1'   // level 1
  if (yrs <= 4) return 'RN2'  // level 2
  return 'RN3'                // level 3
}

/** ป้าย level แบบสั้นสำหรับแสดงผล */
export function levelLabel(pos: NursePosition): string {
  switch (pos) {
    case 'RN1': return 'L1'
    case 'RN2': return 'L2'
    case 'RN3': return 'L3'
    default: return ''
  }
}
