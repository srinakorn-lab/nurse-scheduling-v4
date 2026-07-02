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

// ══ IPD wards — จากรูปถ่ายตารางเวร ก.ค.69 (ชัด) · level คำนวณจากวันเริ่มงาน ══
// ผู้จัดการแผนก (ขึ้นเวร ช) = CO · CNS = CNS · RN อื่น = RN1/2/3 (<2ปี=L1, 2-4=L2, >4=L3)

// ── Ward 6A (RN — รูป IMG_5076) ──
export const DEFAULT_W6A_RN: Nurse[] = [
  { id: 'W6A_R00', name: 'ดารุณี ชุมสนาม',       position: 'CO',  group: 'RN', order: 0,  active: true, start_date: '1 เม.ย.2550', nickname: 'ผจก.แผนก' },
  { id: 'W6A_R01', name: 'จินตนา สีดาโคตร์',      position: 'CNS', group: 'RN', order: 1,  active: true, start_date: '1 เม.ย.2554', nickname: 'เอฟ' },
  { id: 'W6A_R02', name: 'อรียา ตุ่นกระโทก',      position: 'RN2', group: 'RN', order: 2,  active: true, start_date: '1 ต.ค.2567',  nickname: 'มายค์' },
  { id: 'W6A_R03', name: 'ธนภรณ์ ปรางสวรรค์',     position: 'RN4', group: 'RN', order: 3,  active: true, start_date: '1 ก.ย.2563',  nickname: 'อุ้ย' },
  { id: 'W6A_R04', name: 'ณภัสร์นันท์ สุวรรณ',    position: 'RN3', group: 'RN', order: 4,  active: true, start_date: '1 เม.ย.2566', nickname: 'ใหม' },
  { id: 'W6A_R05', name: 'อนุชธิดา สารโคตร',      position: 'RN1', group: 'RN', order: 5,  active: true, start_date: '1 ก.ค.2568',  nickname: 'กิฟท์' },
  { id: 'W6A_R06', name: 'ธัญญลักษณ์ เพื่อแผ่',    position: 'RN2', group: 'RN', order: 6,  active: true, start_date: '1 ก.ย.2567',  nickname: 'ป้อน' },
  { id: 'W6A_R07', name: 'รานี หล้าเดือน',        position: 'RN1', group: 'RN', order: 7,  active: true, start_date: '1 มิ.ย.2568', nickname: 'นุ่น' },
  { id: 'W6A_R08', name: 'ภันทิลา ปัดถมา',        position: 'RN3', group: 'RN', order: 8,  active: true, start_date: '1 ก.ย.2565',  nickname: 'กิ๊ก' },
  { id: 'W6A_R09', name: 'อ้อมจันทร์ คูลี',        position: 'RN4', group: 'RN', order: 9,  active: true, start_date: '16 ก.พ.2561', nickname: 'อ้อม' },
  { id: 'W6A_R10', name: 'จิระนันท์ หัดสูงเนิน',   position: 'RN1', group: 'RN', order: 10, active: true, start_date: '16 มิ.ย.2569', nickname: 'ไอซ์' },
]

// ── Ward 6B (RN — รูป IMG_5073) · #8-11 tag W7A (ขึ้นเวรใน 6B) ──
export const DEFAULT_W6B_RN: Nurse[] = [
  { id: 'W6B_R00', name: 'ศุภัสรา เทียนเมาะ',      position: 'CO',  group: 'RN', order: 0,  active: true, start_date: '1 ก.ค.2547',  nickname: 'จอย/ผจก.' },
  { id: 'W6B_R01', name: 'กัญญารัตน์ วิภาสวัสดิ์',  position: 'RN3', group: 'RN', order: 1,  active: true, start_date: '1 ต.ค.2565',  nickname: 'เอร่น' },
  { id: 'W6B_R02', name: 'สุวนันท์ ที่บ้านบ่อ',     position: 'RN2', group: 'RN', order: 2,  active: true, start_date: '',            nickname: 'แดง (ลาคลอด)' },
  { id: 'W6B_R03', name: 'ศรัณย์รัชต์ สุวรรณ',     position: 'RN2', group: 'RN', order: 3,  active: true, start_date: '',            nickname: 'มุก' },
  { id: 'W6B_R04', name: 'สุพัตรา ชัยภา',         position: 'RN2', group: 'RN', order: 4,  active: true, start_date: '1 ส.ค.2567',  nickname: 'โบว์' },
  { id: 'W6B_R05', name: 'เสาวลักษณ์ จดไว้',      position: 'RN2', group: 'RN', order: 5,  active: true, start_date: '',            nickname: 'ดาด้า' },
  { id: 'W6B_R06', name: 'มยุรา สีดาแดง',         position: 'RN2', group: 'RN', order: 6,  active: true, start_date: '16 เม.ย.2566', nickname: 'แอ้ว' },
  { id: 'W6B_R07', name: 'บัณฑิตา ของดี',         position: 'RN2', group: 'RN', order: 7,  active: true, start_date: '1 พ.ค.2567',  nickname: 'มุก' },
  { id: 'W6B_R08', name: 'กมลทิพย์ จรูญเนตร (W7A)', position: 'RN4', group: 'RN', order: 8,  active: true, start_date: '1 พ.ย.2565',  nickname: 'แน่ว' },
  { id: 'W6B_R09', name: 'อภิญญา ฉายกิ่ง (W7A)',   position: 'RN4', group: 'RN', order: 9,  active: true, start_date: '',            nickname: 'กิ๊ฟ' },
  { id: 'W6B_R10', name: 'จุฬารักษณ์ ศรีฮาด (W7A)', position: 'RN4', group: 'RN', order: 10, active: true, start_date: '1 ส.ค.2562',  nickname: 'จิ๋ม' },
  { id: 'W6B_R11', name: 'ปรางฤทัย แพงทอง (W7A)',  position: 'RN4', group: 'RN', order: 11, active: true, start_date: '1 ก.ย.2561',  nickname: 'น้ำ' },
  { id: 'W6B_R12', name: 'แพรวพรรณ ก้องสูงเนิน',   position: 'RN1', group: 'RN', order: 12, active: true, start_date: '20 พ.ค.2569', nickname: 'แพรว' },
]

// ── Ward 7A (PN — รูป IMG_5070) ──
export const DEFAULT_W7A_PN: Nurse[] = [
  { id: 'W7A_P01', name: 'ฐิรกานต์ ภาพกลาง',   position: 'PN', group: 'PN', order: 1,  active: true, start_date: '16 ก.ค.2553', nickname: 'รี' },
  { id: 'W7A_P02', name: 'จิราวดี ก้อนคำใหญ่',  position: 'PN', group: 'PN', order: 2,  active: true, start_date: '1 พ.ค.2558',  nickname: 'ฟ้า' },
  { id: 'W7A_P03', name: 'สุธิดา หงษ์ยนต์',     position: 'PN', group: 'PN', order: 3,  active: true, start_date: '1 ก.ค.2561',  nickname: 'หลิว' },
  { id: 'W7A_P04', name: 'พรหมธิดา จันหลง',     position: 'PN', group: 'PN', order: 4,  active: true, start_date: '16 มี.ค.2560', nickname: 'ต่าย' },
  { id: 'W7A_P05', name: 'อรอนงค์ การุณ',       position: 'PN', group: 'PN', order: 5,  active: true, start_date: '1 ม.ค.2564',  nickname: 'ฟ้า' },
  { id: 'W7A_P06', name: 'มาศฤดี ใขมูง',        position: 'PN', group: 'PN', order: 6,  active: true, start_date: '1 ก.ย.2566',  nickname: 'บิว' },
  { id: 'W7A_P07', name: 'ปานรุ้ง อ่อนน้อม',    position: 'PN', group: 'PN', order: 7,  active: true, start_date: '16 ก.ย.2566', nickname: 'แป้ง' },
  { id: 'W7A_P08', name: 'วิลาสินี ขีรัมย์',     position: 'PN', group: 'PN', order: 8,  active: true, start_date: '1 ต.ค.2566',  nickname: 'มายค์' },
  { id: 'W7A_P09', name: 'ลักษณา จินดา',        position: 'PN', group: 'PN', order: 9,  active: true, start_date: '',            nickname: 'ปลา' },
  { id: 'W7A_P10', name: 'ศุภษร พวงเพชร',       position: 'PN', group: 'PN', order: 10, active: true, start_date: '',            nickname: 'กุ้ง' },
  { id: 'W7A_P11', name: 'นันทิชา สีขาว',       position: 'PN', group: 'PN', order: 11, active: true, start_date: '',            nickname: 'กบ', day_only: true },
]

// ── Ward 9A (RN — รูป IMG_5063) ──
export const DEFAULT_W9A_RN: Nurse[] = [
  { id: 'W9A_R00', name: 'ทัศนีย์ การุณ',       position: 'CO',  group: 'RN', order: 0, active: true, start_date: '1 พ.ค.2548', nickname: 'ผจก.แผนก' },
  { id: 'W9A_R01', name: 'ปิยะนุช อินทร์แก้ว',   position: 'RN3', group: 'RN', order: 1, active: true, start_date: '1 ก.ย.2556', nickname: 'ฟ้ง' },
  { id: 'W9A_R02', name: 'สุพัตรา แก้วคำ',       position: 'RN3', group: 'RN', order: 2, active: true, start_date: '1 เม.ย.2556', nickname: 'ปุ้ย' },
  { id: 'W9A_R03', name: 'ฉัตรแก้ว โถทอง',       position: 'RN3', group: 'RN', order: 3, active: true, start_date: '16 ก.ค.2562', nickname: 'แจน' },
  { id: 'W9A_R04', name: 'มลฤดี ทองรส',         position: 'RN3', group: 'RN', order: 4, active: true, start_date: '1 ก.ย.2561', nickname: 'หญิง' },
  { id: 'W9A_R05', name: 'บัณฑวรรณ จำปาเรือง',   position: 'RN3', group: 'RN', order: 5, active: true, start_date: '1 ก.ย.2564', nickname: 'รส' },
  { id: 'W9A_R06', name: 'ปัทมา อิ่มบุตร',       position: 'RN3', group: 'RN', order: 6, active: true, start_date: '1 ส.ค.2559', nickname: 'แพท' },
  { id: 'W9A_R07', name: 'นิภาพร จำปาแก้ว',      position: 'RN2', group: 'RN', order: 7, active: true, start_date: '1 ก.ย.2567', nickname: 'อ้อม' },
  { id: 'W9A_R08', name: 'วิศรา คำหม้อ',         position: 'RN1', group: 'RN', order: 8, active: true, start_date: '1 มี.ค.2569', nickname: 'จี๋' },
  // หน้า 2 (รูป IMG_5066)
  { id: 'W9A_R09', name: 'จันทร์หอม ศรีสกุลทอง',  position: 'RN3', group: 'RN', order: 9,  active: true, start_date: '1 ก.ย.2551', nickname: 'ปุ๊ย' },
  { id: 'W9A_R10', name: 'อรณี โพธิวรรณ',        position: 'RN2', group: 'RN', order: 10, active: true, start_date: '',           nickname: 'บี' },
  { id: 'W9A_R11', name: 'สโรชา ปะอางค์',        position: 'RN2', group: 'RN', order: 11, active: true, start_date: '',           nickname: 'โร' },
  { id: 'W9A_R12', name: 'ธัญญรัตน์ แหงไธสง',     position: 'RN2', group: 'RN', order: 12, active: true, start_date: '1 ก.พ.2566', nickname: 'สปอยด์' },
  { id: 'W9A_R13', name: 'นันทิยา สดนางรอง',      position: 'RN3', group: 'RN', order: 13, active: true, start_date: '1 พ.ค.2556', nickname: 'เคลียร์' },
  { id: 'W9A_R14', name: 'อริษา จงกลรัตน์',       position: 'RN1', group: 'RN', order: 14, active: true, start_date: '3 มิ.ย.2568', nickname: 'ป๊อป' },
]

// ── Ward 9A (PN — รูป IMG_5064) ──
export const DEFAULT_W9A_PN: Nurse[] = [
  { id: 'W9A_P00', name: 'คศิธร พิสิทธ์',         position: 'PN', group: 'PN', order: 0,  active: true, start_date: '', nickname: 'บีม (ช)', day_only: true },
  { id: 'W9A_P01', name: 'เหมรัตน์ สุโขยชัย',      position: 'PN', group: 'PN', order: 1,  active: true, start_date: '1 พ.ค.2546',  nickname: 'แดม' },
  { id: 'W9A_P02', name: 'ศุภานันท์ เสลาแก้ว',     position: 'PN', group: 'PN', order: 2,  active: true, start_date: '1 ก.ย.2552',  nickname: 'ขวัญ' },
  { id: 'W9A_P03', name: 'สุวนันท์ นนธิจันทร์',    position: 'PN', group: 'PN', order: 3,  active: true, start_date: '6 มี.ค.2561', nickname: 'นันท์' },
  { id: 'W9A_P04', name: 'จินตนาภรณ์ เมาชัยสงค์',  position: 'PN', group: 'PN', order: 4,  active: true, start_date: '1 ก.ค.2558',  nickname: 'ฝน' },
  { id: 'W9A_P05', name: 'พิกุล แย้มนาม',         position: 'PN', group: 'PN', order: 5,  active: true, start_date: '16 ก.พ.2561', nickname: '' },
  { id: 'W9A_P06', name: 'วีรญา บังเมฆ',          position: 'PN', group: 'PN', order: 6,  active: true, start_date: '1 ส.ค.2554',  nickname: 'ยุ' },
  { id: 'W9A_P07', name: 'นพรัตน์ อินธิแสง',       position: 'PN', group: 'PN', order: 7,  active: true, start_date: '1 ต.ค.2559',  nickname: 'หญิง' },
  { id: 'W9A_P08', name: 'ประภัสสรา ดงคุด',       position: 'PN', group: 'PN', order: 8,  active: true, start_date: '1 ก.ค.2566',  nickname: 'มายด์' },
  { id: 'W9A_P09', name: 'มลธิชา ชื่นอุรา',        position: 'PN', group: 'PN', order: 9,  active: true, start_date: '1 ก.พ.2566',  nickname: 'ฝ้าย' },
  { id: 'W9A_P10', name: 'อรทัย เสนามาตรว์',       position: 'PN', group: 'PN', order: 10, active: true, start_date: '1 ส.ค.2556',  nickname: 'อัง' },
]

// ── Ward 7A (RN — รูป IMG_5069) ──
export const DEFAULT_W7A_RN: Nurse[] = [
  { id: 'W7A_R00', name: 'พัชรี ทองไพบูลย์',      position: 'CO',  group: 'RN', order: 0, active: true, start_date: '',           nickname: 'ผจก.แผนก' },
  { id: 'W7A_R01', name: 'สุรวีย์ มีศิริ',         position: 'RN3', group: 'RN', order: 1, active: true, start_date: '1 ส.ค.2564', nickname: 'อิ่ม' },
  { id: 'W7A_R02', name: 'ชุติกาญจน์ ศรีบุญเรือง', position: 'RN2', group: 'RN', order: 2, active: true, start_date: '1 ก.ย.2566', nickname: 'หมวย' },
  { id: 'W7A_R03', name: 'กมลชนก เถระพันธ์',      position: 'RN2', group: 'RN', order: 3, active: true, start_date: '16 ก.พ.2566', nickname: 'ขวัญ' },
  { id: 'W7A_R04', name: 'กฤษฌา สีโท',           position: 'RN2', group: 'RN', order: 4, active: true, start_date: '1 พ.ค.2566', nickname: 'โน๊ต' },
  { id: 'W7A_R05', name: 'ปริญดา โต่นวุธ',        position: 'RN2', group: 'RN', order: 5, active: true, start_date: '1 พ.ค.2566', nickname: 'อีฟ' },
  { id: 'W7A_R06', name: 'ปณิดา ยศงาม',          position: 'RN2', group: 'RN', order: 6, active: true, start_date: '16 ส.ค.2567', nickname: 'อิงอร' },
  { id: 'W7A_R07', name: 'ชัญญานุช บุญลือ',       position: 'RN1', group: 'RN', order: 7, active: true, start_date: '1 มี.ค.2569', nickname: 'นุ่น' },
  { id: 'W7A_R08', name: 'กาญจนา ลาดคูบอน',       position: 'RN2', group: 'RN', order: 8, active: true, start_date: '',           nickname: 'เนตร' },
  { id: 'W7A_R09', name: 'ปนิดา นารีน้อย',        position: 'RN2', group: 'RN', order: 9, active: true, start_date: '',           nickname: 'หวาน' },
]

// ── Ward 10A (RN — รูป IMG_5068) ──
export const DEFAULT_W10A_RN: Nurse[] = [
  { id: 'W10A_R00', name: 'บุณยาพร กลิ่นเพ็ชร์',   position: 'CO',  group: 'RN', order: 0, active: true, start_date: '1 ก.ค.2559', nickname: 'แพรว/ผจก.' },
  { id: 'W10A_R01', name: 'จตุพร สุคาทิพย์',       position: 'RN2', group: 'RN', order: 1, active: true, start_date: '16 ก.ย.2565', nickname: 'ปุ๋ย' },
  { id: 'W10A_R02', name: 'นภกุล จันทรานุวงศ์',    position: 'RN2', group: 'RN', order: 2, active: true, start_date: '1 พ.ย.2565', nickname: 'กุ๊กกิ๊ก' },
  { id: 'W10A_R03', name: 'ทิพยสุคนธ์ ปะวะโก',     position: 'RN1', group: 'RN', order: 3, active: true, start_date: '1 ก.ค.2568', nickname: 'นิ่ง' },
  { id: 'W10A_R04', name: 'รินลดา นัคควงค์',       position: 'RN1', group: 'RN', order: 4, active: true, start_date: '16 ส.ค.2568', nickname: 'เปรี้ยว' },
  { id: 'W10A_R05', name: 'สุมาลี นารินทร์',       position: 'RN1', group: 'RN', order: 5, active: true, start_date: '16 ส.ค.2568', nickname: 'เอิร์น' },
  { id: 'W10A_R06', name: 'ปณัฐดา ศรีรักษา',       position: 'RN1', group: 'RN', order: 6, active: true, start_date: '16 ต.ค.2568', nickname: 'เฟื่อง' },
  { id: 'W10A_R07', name: 'พิริยา แก้วหล่อ',       position: 'RN1', group: 'RN', order: 7, active: true, start_date: '1 มี.ค.2569', nickname: 'อีฟ' },
  { id: 'W10A_R08', name: 'กิตติยา สอนศิลป์',      position: 'RN1', group: 'RN', order: 8, active: true, start_date: '1 มี.ค.2569', nickname: 'ตอง' },
]

// ── Ward 10A (PN — รูป IMG_5067) ──
export const DEFAULT_W10A_PN: Nurse[] = [
  { id: 'W10A_P00', name: 'บังอร นามวงศ์',         position: 'WC', group: 'PN', order: 0, active: true, start_date: '1 ก.ค.2556', nickname: 'อร' },
  { id: 'W10A_P01', name: 'อุไรวรรณ ฝั่นอินทร์',    position: 'PN', group: 'PN', order: 1, active: true, start_date: '1 ส.ค.2556', nickname: 'ใหม่' },
  { id: 'W10A_P02', name: 'ชไมพร มือทอง',         position: 'PN', group: 'PN', order: 2, active: true, start_date: '16 พ.ค.2567', nickname: 'ไม (ลาคลอด)' },
  { id: 'W10A_P03', name: 'ดารชา ชุยรัมย์',        position: 'PN', group: 'PN', order: 3, active: true, start_date: '1 พ.ค.2557', nickname: 'โอ๋' },
  { id: 'W10A_P04', name: 'ภาวิณี เพชรไธสง',       position: 'PN', group: 'PN', order: 4, active: true, start_date: '1 ส.ค.2554', nickname: 'ปุ้ม' },
  { id: 'W10A_P05', name: 'ณัชวนันท์ สุวรรณเรือง',  position: 'PN', group: 'PN', order: 5, active: true, start_date: '1 พ.ย.2559', nickname: 'ออ' },
  { id: 'W10A_P06', name: 'สิริลักษณ์ วงศ์ศักดิ์',   position: 'PN', group: 'PN', order: 6, active: true, start_date: '1 ส.ค.2564', nickname: 'บะหมี่' },
  { id: 'W10A_P07', name: 'ภนิดา นามผล',          position: 'PN', group: 'PN', order: 7, active: true, start_date: '1 ก.ย.2565', nickname: 'เป้' },
  { id: 'W10A_P08', name: 'เนาวรัตน์ จันทดี',       position: 'PN', group: 'PN', order: 8, active: true, start_date: '16 มี.ค.2566', nickname: 'ไหม' },
  { id: 'W10A_P09', name: 'จันธิมาภรณ์ ภักดี',      position: 'PN', group: 'PN', order: 9, active: true, start_date: '1 เม.ย.2568', nickname: 'ฝน' },
]

// ── Ward 6A (PN — รูป IMG_5077) ──
export const DEFAULT_W6A_PN: Nurse[] = [
  { id: 'W6A_P01', name: 'ธันยพร โซตินอก',        position: 'PN', group: 'PN', order: 1,  active: true, start_date: '1 พ.ค.2564',  nickname: 'เอ๊ะ' },
  { id: 'W6A_P02', name: 'ฐิตาภา หวังช่วยกลาง',    position: 'PN', group: 'PN', order: 2,  active: true, start_date: '16 ก.ค.2568', nickname: 'อัญ' },
  { id: 'W6A_P03', name: 'เมทาวี ทวีพูน',          position: 'PN', group: 'PN', order: 3,  active: true, start_date: '1 ก.ค.2564',  nickname: 'มิว' },
  { id: 'W6A_P04', name: 'นุชจิรา พรมชาติ',        position: 'PN', group: 'PN', order: 4,  active: true, start_date: '16 พ.ค.2568', nickname: 'เปิ้ล' },
  { id: 'W6A_P05', name: 'รุ่งทิพย์ อาศัยไร่',      position: 'PN', group: 'PN', order: 5,  active: true, start_date: '1 ก.พ.2566',  nickname: 'แนน' },
  { id: 'W6A_P06', name: 'ธรารัตน์ น้อยลี',         position: 'PN', group: 'PN', order: 6,  active: true, start_date: '1 ก.ย.2564',  nickname: 'ป๊อบ' },
  { id: 'W6A_P07', name: 'จิราพร พิมเห็ม',         position: 'PN', group: 'PN', order: 7,  active: true, start_date: '16 ส.ค.2566', nickname: 'เปรียว' },
  { id: 'W6A_P08', name: 'กมลรัตน์ แหวนวงค์',      position: 'PN', group: 'PN', order: 8,  active: true, start_date: '1 ม.ค.2562',  nickname: 'จอย' },
  { id: 'W6A_P09', name: 'สุพัตรา พรมดี',          position: 'PN', group: 'PN', order: 9,  active: true, start_date: '16 ก.ย.2558', nickname: 'หนุ่ย' },
  { id: 'W6A_P10', name: 'สุวรรณิกา บุตรเสมียน',    position: 'PN', group: 'PN', order: 10, active: true, start_date: '1 ก.ย.2550',  nickname: 'อุ้ม' },
  { id: 'W6A_P11', name: 'มาลัยวัลย์ จันนา',        position: 'WC', group: 'PN', order: 11, active: true, start_date: '',            nickname: 'น้อง', day_only: true },
]

// ── Ward 6B (PN — รูป IMG_5059/5074/5075) ──
export const DEFAULT_W6B_PN: Nurse[] = [
  { id: 'W6B_P00', name: 'ธีรพร ชุรีกร',           position: 'WC', group: 'PN', order: 0,  active: true, start_date: '',            nickname: 'กุ้ง', day_only: true },
  { id: 'W6B_P01', name: 'สายใจ วงษา',            position: 'PN', group: 'PN', order: 1,  active: true, start_date: '1 ก.ย.2552',  nickname: 'หนุ่ย' },
  { id: 'W6B_P02', name: 'วนิดา จรูญภักดิ์',        position: 'PN', group: 'PN', order: 2,  active: true, start_date: '1 ก.ย.2553',  nickname: 'ติ๊ก' },
  { id: 'W6B_P03', name: 'ชนัดฎา เทพกุญชร',       position: 'PN', group: 'PN', order: 3,  active: true, start_date: '1 มี.ค.2561', nickname: 'ออม' },
  { id: 'W6B_P04', name: 'ดาราวรรณ ก้อนจันเทศ',    position: 'PN', group: 'PN', order: 4,  active: true, start_date: '16 ก.ย.2554', nickname: 'ฝน' },
  { id: 'W6B_P05', name: 'รุ่งทิวา เกิดบัว',        position: 'PN', group: 'PN', order: 5,  active: true, start_date: '',            nickname: 'มุก' },
  { id: 'W6B_P06', name: 'สาริกา อาญาเมือง',       position: 'PN', group: 'PN', order: 6,  active: true, start_date: '1 ก.พ.2566',  nickname: 'เตียง' },
  { id: 'W6B_P07', name: 'กรรณิการ์ สมศรี',        position: 'PN', group: 'PN', order: 7,  active: true, start_date: '1 ก.ค.2559',  nickname: 'บิว' },
  { id: 'W6B_P08', name: 'อรทัย ชัยมา',            position: 'PN', group: 'PN', order: 8,  active: true, start_date: '1 ก.ย.2566',  nickname: 'ก้อย' },
  { id: 'W6B_P09', name: 'จิราพร ศรีสุภา',          position: 'PN', group: 'PN', order: 9,  active: true, start_date: '16 ส.ค.2566', nickname: 'จิน' },
  { id: 'W6B_P10', name: 'ดวงสุรีย์ นัยนิตย์',       position: 'PN', group: 'PN', order: 10, active: true, start_date: '16 ส.ค.2556', nickname: 'ยุ้ย' },
  { id: 'W6B_P11', name: 'ศศิกานต์ บัวแสง',         position: 'PN', group: 'PN', order: 11, active: true, start_date: '',            nickname: 'กานต์' },
  { id: 'W6B_P12', name: 'สุภารัตน์ สิมสาร',        position: 'PN', group: 'PN', order: 12, active: true, start_date: '1 ก.ย.2567',  nickname: 'แคท' },
  { id: 'W6B_P13', name: 'วาสนา เลือดทหาร',        position: 'PN', group: 'PN', order: 13, active: true, start_date: '1 ส.ค.2566',  nickname: 'เอริ่น' },
  { id: 'W6B_P14', name: 'กานต์ธิดา บุรีวงค์',      position: 'PN', group: 'PN', order: 14, active: true, start_date: '1 ก.ค.2568',  nickname: 'นิว' },
  { id: 'W6B_P15', name: 'พรอรุณ จิปอมจา',        position: 'PN', group: 'PN', order: 15, active: true, start_date: '1 พ.ค.2560',  nickname: 'กุ้งนาง' },
  { id: 'W6B_P16', name: 'ธิวารัต แป้นแหลม',       position: 'PN', group: 'PN', order: 16, active: true, start_date: '1 ส.ค.2557',  nickname: 'เรย์' },
]

// ── Ward 8A (RN — รูป IMG_5071) ──
export const DEFAULT_W8A_RN: Nurse[] = [
  { id: 'W8A_R00', name: 'พิธพร คนคม',            position: 'CO',  group: 'RN', order: 0,  active: true, start_date: '',            nickname: 'ผจก.แผนก' },
  { id: 'W8A_R01', name: 'นันทิยา คำก้อน',         position: 'RN3', group: 'RN', order: 1,  active: true, start_date: '1 เม.ย.2550', nickname: 'เปิ้ล' },
  { id: 'W8A_R02', name: 'เกสริน ชุมเงิน',          position: 'RN3', group: 'RN', order: 2,  active: true, start_date: '1 เม.ย.2554', nickname: 'ติว' },
  { id: 'W8A_R03', name: 'วงศ์พระจันทร์ ดวงหม่อง',  position: 'RN3', group: 'RN', order: 3,  active: true, start_date: '1 มิ.ย.2559', nickname: 'เมย์' },
  { id: 'W8A_R04', name: 'อารีย์ สายปาน',          position: 'RN3', group: 'RN', order: 4,  active: true, start_date: '1 เม.ย.2560', nickname: 'น้ำ' },
  { id: 'W8A_R05', name: 'อธิติญา ประสานพันธุ',     position: 'RN3', group: 'RN', order: 5,  active: true, start_date: '1 พ.ค.2561',  nickname: 'เค้ก' },
  { id: 'W8A_R06', name: 'นวพร จั่นนิน',           position: 'RN2', group: 'RN', order: 6,  active: true, start_date: '16 พ.ย.2565', nickname: 'แพรว' },
  { id: 'W8A_R07', name: 'พุทธรักษ์ เทียมชัยภูมิ',   position: 'RN2', group: 'RN', order: 7,  active: true, start_date: '16 ก.พ.2566', nickname: 'แตงกวา' },
  { id: 'W8A_R08', name: 'ลัทธวรรณ วิสูงเร',        position: 'RN2', group: 'RN', order: 8,  active: true, start_date: '1 เม.ย.2566', nickname: 'วรรณ' },
  { id: 'W8A_R09', name: 'เพ็ญพิศุทธิ์ เรืองไสยพร',  position: 'RN2', group: 'RN', order: 9,  active: true, start_date: '1 พ.ค.2566',  nickname: 'น้ำหวาน' },
  { id: 'W8A_R10', name: 'พัชญาภรณ์ อนุสา',        position: 'RN1', group: 'RN', order: 10, active: true, start_date: '1 มิ.ย.2569', nickname: 'แพท' },
]

// ── Ward 8A (PN — รูป IMG_5072) ──
export const DEFAULT_W8A_PN: Nurse[] = [
  { id: 'W8A_P01', name: 'ชนิษฐา ปาปะสา',         position: 'PN', group: 'PN', order: 1,  active: true, start_date: '16 ต.ค.2551', nickname: 'โอ๋' },
  { id: 'W8A_P02', name: 'สุธาวัลย์ กุญชรรักษ์',     position: 'PN', group: 'PN', order: 2,  active: true, start_date: '16 ก.พ.2561', nickname: 'ฟ้า' },
  { id: 'W8A_P03', name: 'วัลศิกา นิวงษา',          position: 'PN', group: 'PN', order: 3,  active: true, start_date: '1 ส.ค.2558',  nickname: 'อาย' },
  { id: 'W8A_P04', name: 'ศรีวิพัฒน์ จำสอน',        position: 'PN', group: 'PN', order: 4,  active: true, start_date: '1 เม.ย.2558', nickname: 'เหมย' },
  { id: 'W8A_P05', name: 'อรณิชา ทานะ',           position: 'PN', group: 'PN', order: 5,  active: true, start_date: '1 ก.ย.2561',  nickname: 'ปุ๊ก' },
  { id: 'W8A_P06', name: 'กฤตชญาณ์ หมายกล้า',     position: 'PN', group: 'PN', order: 6,  active: true, start_date: '1 ก.ย.2566',  nickname: 'เปิ้ล' },
  { id: 'W8A_P07', name: 'อรัญญา ธรรมสิมมา',      position: 'PN', group: 'PN', order: 7,  active: true, start_date: '1 ก.ย.2566',  nickname: 'สาย' },
  { id: 'W8A_P08', name: 'ศิริลักษณ์ จำปาทอง',      position: 'PN', group: 'PN', order: 8,  active: true, start_date: '16 ก.พ.2567', nickname: 'แน๊ม' },
  { id: 'W8A_P09', name: 'วิยะดา ธุรีวงษ์',          position: 'PN', group: 'PN', order: 9,  active: true, start_date: '16 ก.ย.2566', nickname: 'ชมพู่' },
  { id: 'W8A_P10', name: 'ณภาพร วินทระ',          position: 'PN', group: 'PN', order: 10, active: true, start_date: '16 ต.ค.2567', nickname: 'แป้ง' },
  { id: 'W8A_P11', name: 'ชัญญานุช ใจจันทร์',       position: 'WC', group: 'PN', order: 11, active: true, start_date: '1 ส.ค.2566',  nickname: 'ตั๊ก', day_only: true },
]

// ── Ward 12A (RN — รูป IMG_5060 หน้า 2 · level ตามเอกสาร · หน้า 1 ยังไม่มีรูปชัด) ──
export const DEFAULT_W12A_RN: Nurse[] = [
  { id: 'W12A_R00', name: 'กมลชนก อุปมัย',        position: 'CO',  group: 'RN', order: 0,  active: true, start_date: '1 ม.ค.2554',  nickname: 'กิ๊ก/ผจก.W12A+W11A' },
  { id: 'W12A_R08', name: 'สมคิด ศรีคงรักษ์',      position: 'CNS', group: 'RN', order: 8,  active: true, start_date: '1 เม.ย.2550', nickname: 'นิ' },
  { id: 'W12A_R09', name: 'วิไลพร บุญเรือง',       position: 'RN4', group: 'RN', order: 9,  active: true, start_date: '1 มิ.ย.2556', nickname: 'โหน่ง' },
  { id: 'W12A_R10', name: 'ธนาพร วันนา',          position: 'RN4', group: 'RN', order: 10, active: true, start_date: '1 ก.ย.2559',  nickname: 'เบียร์' },
  { id: 'W12A_R11', name: 'อรุณกมล บัวศรี',        position: 'RN3', group: 'RN', order: 11, active: true, start_date: '1 ก.ค.2562',  nickname: 'มด' },
  { id: 'W12A_R12', name: 'ศรสวรรค์ ศักดิ์ศรี',      position: 'RN2', group: 'RN', order: 12, active: true, start_date: '1 เม.ย.2564', nickname: 'ปุ๊กกี้ (ลาคลอด)' },
  { id: 'W12A_R13', name: 'บุญญาพร บุสบง',        position: 'RN1', group: 'RN', order: 13, active: true, start_date: '1 มี.ค.2569', nickname: 'พลอย (W9A)' },
]

// ── Ward 12A (PN — รูป IMG_5062 · วันที่เอกสารเป็น ค.ศ. แปลงเป็น พ.ศ. แล้ว) ──
export const DEFAULT_W12A_PN: Nurse[] = [
  { id: 'W12A_P01', name: 'กานต์รวี อักษร',        position: 'PN', group: 'PN', order: 1, active: true, start_date: '1 ก.ย.2548',  nickname: 'ติ๊ก' },
  { id: 'W12A_P02', name: 'พลอยลดา วิชัยยา',      position: 'PN', group: 'PN', order: 2, active: true, start_date: '1 มิ.ย.2562', nickname: 'เอย' },
  { id: 'W12A_P03', name: 'ศิตา ดาตาวงต์',         position: 'PN', group: 'PN', order: 3, active: true, start_date: '15 ส.ค.2559', nickname: 'ป๊อบ' },
  { id: 'W12A_P04', name: 'อุบล สนธัมย์',          position: 'PN', group: 'PN', order: 4, active: true, start_date: '1 พ.ย.2560',  nickname: 'เก๋' },
  { id: 'W12A_P05', name: 'วรรณนภา เลาะสันเทียะ',  position: 'PN', group: 'PN', order: 5, active: true, start_date: '1 ส.ค.2559',  nickname: 'แคท' },
  { id: 'W12A_P06', name: 'ปัทมา สุริยนต์',         position: 'PN', group: 'PN', order: 6, active: true, start_date: '1 เม.ย.2556', nickname: 'หนูนา' },
  { id: 'W12A_P07', name: 'วารุณี ชมภูทอง',        position: 'PN', group: 'PN', order: 7, active: true, start_date: '1 เม.ย.2561', nickname: 'แพรวา' },
  { id: 'W12A_P08', name: 'ประภาพร กายแก้ว',      position: 'PN', group: 'PN', order: 8, active: true, start_date: '1 ก.ย.2566',  nickname: 'ครีม' },
  { id: 'W12A_P09', name: 'ศศิกานต์ แป้นกระโทก',   position: 'PN', group: 'PN', order: 9, active: true, start_date: '1 ก.ย.2566',  nickname: 'มะปราง' },
]

// สร้าง skeleton — จำนวนคนถูกต้องจาก PDF, ชื่อ placeholder ให้ HOD แก้ (ยังไม่มีรูปชัด)
function wardSkeleton(dept: string, rnCount: number, pnCount: number): Nurse[] {
  const list: Nurse[] = []
  for (let i = 1; i <= rnCount; i++) {
    list.push({ id: `${dept}_R${String(i).padStart(2, '0')}`, name: `⚠ แก้ชื่อ ${dept}-RN-${i}`, position: 'RN2', group: 'RN', order: i, active: true })
  }
  for (let i = 1; i <= pnCount; i++) {
    list.push({ id: `${dept}_P${String(i).padStart(2, '0')}`, name: `⚠ แก้ชื่อ ${dept}-PN-${i}`, position: 'PN', group: 'PN', order: i, active: true })
  }
  return list
}

export function getDefaultNurses(dept: string): Nurse[] {
  switch (dept) {
    case 'CCU': return [...DEFAULT_CCU_RN, ...DEFAULT_CCU_PN]
    case 'NCU': return [...DEFAULT_NCU_RN, ...DEFAULT_NCU_PN]
    case 'ICU': return [...DEFAULT_ICU_RN, ...DEFAULT_ICU_PN]
    case 'W6A': return [...DEFAULT_W6A_RN, ...DEFAULT_W6A_PN]              // ครบทั้งคู่
    case 'W6B': return [...DEFAULT_W6B_RN, ...DEFAULT_W6B_PN]              // ครบทั้งคู่
    case 'W7A': return [...DEFAULT_W7A_RN, ...DEFAULT_W7A_PN]              // ครบทั้งคู่
    case 'W8A': return [...DEFAULT_W8A_RN, ...DEFAULT_W8A_PN]              // ครบทั้งคู่
    case 'W9A': return [...DEFAULT_W9A_RN, ...DEFAULT_W9A_PN]              // ครบทั้งคู่
    case 'W10A': return [...DEFAULT_W10A_RN, ...DEFAULT_W10A_PN]           // ครบทั้งคู่
    // W11A + W12A ใช้บุคลากรร่วมกัน (roster เดียวกัน) — RN หน้า 1 (7 คน) ยังเป็น skeleton รอรูปชัด
    case 'W11A':
    case 'W12A': return [...DEFAULT_W12A_RN, ...wardSkeleton('W12A', 7, 0), ...DEFAULT_W12A_PN]
    default:     return []
  }
}
