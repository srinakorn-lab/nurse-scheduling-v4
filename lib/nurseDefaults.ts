import type { Nurse } from './types'

export const DEFAULT_CCU_RN: Nurse[] = [
  { id: 'R001', name: 'ศรีนคร โคทะนา',       position: 'HOD', group: 'RN', order: 0,  active: true },
  { id: 'R002', name: 'ฐาวิตรี ศรีศิริ',       position: 'CNS', group: 'RN', order: 1,  active: true },
  { id: 'R003', name: 'เจนจุรี ดวงแก้วปั๋น',   position: 'CNS', group: 'RN', order: 2,  active: true },
  { id: 'R004', name: 'ลลิตา แสงส่อง',         position: 'CO',  group: 'RN', order: 3,  active: true },
  { id: 'R005', name: 'มัณฑนา วัฒนะพล',        position: 'RN3', group: 'RN', order: 4,  active: true },
  { id: 'R006', name: 'ไพจิตร หีบแก้ว',        position: 'RN3', group: 'RN', order: 5,  active: true },
  { id: 'R007', name: 'ฐานะดี ส่งทานินทร์',    position: 'RN3', group: 'RN', order: 6,  active: true },
  { id: 'R008', name: 'อินทิรา มีสัตย์',        position: 'RN3', group: 'RN', order: 7,  active: true },
  { id: 'R009', name: 'สิริลักษณ์ จันทเสน',    position: 'RN2', group: 'RN', order: 8,  active: true },
  { id: 'R010', name: 'สโรชา แสงโยธา',         position: 'RN1', group: 'RN', order: 9,  active: true },
  { id: 'R011', name: 'กานต์มณี พรมชาติ',      position: 'RN1', group: 'RN', order: 10, active: true },
  { id: 'R012', name: 'สุดารัตน์ สายโสม',      position: 'RN1', group: 'RN', order: 11, active: true },
  { id: 'R013', name: 'สกาย นาดี',             position: 'RN1', group: 'RN', order: 12, active: true },
]

export const DEFAULT_CCU_PN: Nurse[] = [
  { id: 'P001', name: 'เปมิกา สอนพงษ์',       position: 'PN',  group: 'PN', order: 1,  active: false },
  { id: 'P002', name: 'ละมุล สาลีวงษ์',        position: 'PN',  group: 'PN', order: 2,  active: true },
  { id: 'P003', name: 'สุกัญญา เริงเขตการ',    position: 'PN',  group: 'PN', order: 3,  active: true },
  { id: 'P004', name: 'ขวัญฤดี มีภักดี',       position: 'PN',  group: 'PN', order: 4,  active: true },
  { id: 'P005', name: 'สาวิตรี ชะนะค้า',       position: 'PN',  group: 'PN', order: 5,  active: true },
  { id: 'P006', name: 'ขวัญชนก ปิ่นหอม',       position: 'PN',  group: 'PN', order: 6,  active: true },
  { id: 'P007', name: 'ชลนิภา พุ่มพวง',        position: 'PN',  group: 'PN', order: 7,  active: true },
  { id: 'P008', name: 'ศิรินาฎ ชมจันทร์',      position: 'PN',  group: 'PN', order: 8,  active: true },
  { id: 'P009', name: 'ขวัญธิดา หงษ์สาพันธ์', position: 'PN',  group: 'PN', order: 9,  active: true },
]

export const DEFAULT_NCU_RN: Nurse[] = [
  { id: 'NR001', name: 'กาญจนา ภูมิคำ',        position: 'HOD', group: 'RN', order: 0,  active: true },
  { id: 'NR002', name: 'วิชุตา กุนอก',          position: 'RN3', group: 'RN', order: 1,  active: true },
  { id: 'NR003', name: 'มอญ ไชยสุระ',           position: 'RN3', group: 'RN', order: 2,  active: true },
  { id: 'NR004', name: 'จิราภรณ์ นะวะสด',       position: 'RN3', group: 'RN', order: 3,  active: true },
  { id: 'NR005', name: 'จันทนา เกตุนาค',        position: 'RN3', group: 'RN', order: 4,  active: true },
  { id: 'NR006', name: 'มยุรา ไชบุญญา',         position: 'RN2', group: 'RN', order: 5,  active: true },
  { id: 'NR007', name: 'มนธิรา หาวงศ์',         position: 'RN2', group: 'RN', order: 6,  active: true },
  { id: 'NR008', name: 'รัญชิดา สนคงนอก',       position: 'RN2', group: 'RN', order: 7,  active: true },
  { id: 'NR009', name: 'เพ็ญพลอย อุ่นนา',       position: 'RN2', group: 'RN', order: 8,  active: true },
  { id: 'NR010', name: 'ศศินา ทะนารี',          position: 'RN2', group: 'RN', order: 9,  active: true },
  { id: 'NR011', name: 'กัลยาณี พงษ์วัน',       position: 'RN1', group: 'RN', order: 10, active: true },
  { id: 'NR012', name: 'ณัฐพร พันนุมา',         position: 'RN1', group: 'RN', order: 11, active: true },
  { id: 'NR013', name: 'ชุติมา ปนคำ',           position: 'RN1', group: 'RN', order: 12, active: true },
  { id: 'NR014', name: 'วราลักษณ์ เวฬุวนาธร',   position: 'RN1', group: 'RN', order: 13, active: true },
]

export const DEFAULT_NCU_PN: Nurse[] = [
  { id: 'NP001', name: 'นิภาพร เกษมศรีสุขสง่า',   position: 'PN', group: 'PN', order: 1, active: true },
  { id: 'NP002', name: 'พิชญ์สินี เลิศนราวโรจน์', position: 'PN', group: 'PN', order: 2, active: true },
  { id: 'NP003', name: 'อรนุช วงศ์ษาบุตร',         position: 'PN', group: 'PN', order: 3, active: true },
  { id: 'NP004', name: 'หยาดพิรุณ แสงสว่าง',       position: 'PN', group: 'PN', order: 4, active: true },
  { id: 'NP005', name: 'ประณิตา ศิริวรรณ',          position: 'PN', group: 'PN', order: 5, active: true },
  { id: 'NP006', name: 'ปรัชญา แกมนิล',            position: 'PN', group: 'PN', order: 6, active: true },
  { id: 'NP007', name: 'รติกร จุลพันธ์',           position: 'PN', group: 'PN', order: 7, active: true },
  { id: 'NP008', name: 'หัทยา เผยสง่า',            position: 'PN', group: 'PN', order: 8, active: true },
  { id: 'NP009', name: 'อุลัย จันทร์สว่าง',        position: 'WC', group: 'PN', order: 9, active: true },
]

export const DEFAULT_ICU_RN: Nurse[] = [
  { id: 'IR001', name: 'ศิริลักษณ์ แสนอุบล',    position: 'RN1', group: 'RN', order: 1,  active: true },
  { id: 'IR002', name: 'บุณยวีร์ กลิ่นเพชร์',   position: 'RN1', group: 'RN', order: 2,  active: true },
  { id: 'IR003', name: 'พัชรา สายกระสุน',        position: 'RN1', group: 'RN', order: 3,  active: true },
  { id: 'IR004', name: 'เจนจิรา ศรีสงคราม',     position: 'RN1', group: 'RN', order: 4,  active: true },
  { id: 'IR005', name: 'จิรเนตร พันธุ์คุ้มเก่า', position: 'RN1', group: 'RN', order: 5,  active: true },
  { id: 'IR006', name: 'มารศรี จันทราช',         position: 'RN1', group: 'RN', order: 6,  active: true },
  { id: 'IR007', name: 'ณัฐนนท์ หลายแห่ง',      position: 'RN1', group: 'RN', order: 7,  active: true },
  { id: 'IR008', name: 'นิศาชล หงษ์หิน',        position: 'RN1', group: 'RN', order: 8,  active: true },
  { id: 'IR009', name: 'พัชรพร อินทำ',           position: 'RN1', group: 'RN', order: 9,  active: true },
  { id: 'IR010', name: 'มุยรา ไชบุญญา',          position: 'RN1', group: 'RN', order: 10, active: true },
  { id: 'IR011', name: 'สิริภัคยาภรณ์ พลหาญ',   position: 'RN1', group: 'RN', order: 11, active: true },
  { id: 'IR012', name: 'วันทนีย์ สารักษ์',       position: 'RN1', group: 'RN', order: 12, active: true },
  { id: 'IR013', name: 'เดือนเพ็ญ บุญแก้ว',     position: 'RN1', group: 'RN', order: 13, active: true },
  { id: 'IR014', name: 'อุชเชนี พิจารณ์',        position: 'RN1', group: 'RN', order: 14, active: true },
  { id: 'IR015', name: 'ชญานิศ ชัยฤทธิ์',       position: 'RN1', group: 'RN', order: 15, active: true },
]

export const DEFAULT_ICU_PN: Nurse[] = [
  { id: 'IP001', name: 'อมรา ทองแสง',        position: 'PN', group: 'PN', order: 1,  active: true },
  { id: 'IP002', name: 'ทิพย์พวรรณ สวัสดี',  position: 'PN', group: 'PN', order: 2,  active: true },
  { id: 'IP003', name: 'วราภรณ์ ดำนิน',       position: 'PN', group: 'PN', order: 3,  active: true },
  { id: 'IP004', name: 'รุ่งนภา พวงจำปา',     position: 'PN', group: 'PN', order: 4,  active: true },
  { id: 'IP005', name: 'นัทพร แก้วคำชาติ',    position: 'PN', group: 'PN', order: 5,  active: true },
  { id: 'IP006', name: 'มณีรุ่ง สิงห์คะนอง',  position: 'PN', group: 'PN', order: 6,  active: true },
  { id: 'IP007', name: 'ชลธิชา ยวนยี',        position: 'PN', group: 'PN', order: 7,  active: true },
  { id: 'IP008', name: 'วิจิตรา ไตรยะมูล',    position: 'PN', group: 'PN', order: 8,  active: true },
  { id: 'IP009', name: 'ปวีณา แสนเสน',        position: 'PN', group: 'PN', order: 9,  active: true },
  { id: 'IP010', name: 'ปัณณรัชต์ บูระเนตร', position: 'PN', group: 'PN', order: 10, active: true },
  { id: 'IP011', name: 'การติมา ดีบุปผา',     position: 'PN', group: 'PN', order: 11, active: true },
  { id: 'IP012', name: 'ยลดา พัฒนจักร์',      position: 'PN', group: 'PN', order: 12, active: true },
]

export function getDefaultNurses(dept: string): Nurse[] {
  switch (dept) {
    case 'CCU': return [...DEFAULT_CCU_RN, ...DEFAULT_CCU_PN]
    case 'NCU': return [...DEFAULT_NCU_RN, ...DEFAULT_NCU_PN]
    case 'ICU': return [...DEFAULT_ICU_RN, ...DEFAULT_ICU_PN]
    default:    return []
  }
}
