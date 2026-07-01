import type { ScheduleData, ShiftCode } from './scheduleStore'
import { daysInMonth, thaiDow, SHIFT_STYLE } from './scheduleStore'
import { THAI_MONTHS } from './constants'
import type { Nurse } from './types'

interface NurseStats {
  D: number; N: number; S: number; CH: number
  O: number; leave: number; work: number; hours: number
}

function statsOf(schedule: Record<string, ShiftCode>, id: string, days: number): NurseStats {
  const c = { D: 0, N: 0, S: 0, CH: 0, O: 0, V: 0, T: 0, L: 0 } as Record<string, number>
  for (let d = 1; d <= days; d++) {
    const s = schedule[`${id}-${d}`]
    if (s && s in c) c[s]++
  }
  const leave = c.V + c.T + c.L
  return {
    D: c.D, N: c.N, S: c.S, CH: c.CH, O: c.O,
    leave,
    work: c.D + c.N + c.S + c.CH,
    hours: c.D * 11 + c.N * 11 + c.S * 15 + c.CH * 9 + leave * 11,
  }
}

// ── Build the schedule table as HTML (shared by Excel + PDF) ──────
function buildTableHTML(data: ScheduleData, deptName: string): string {
  const { year, month, nurses, schedule } = data
  const days = daysInMonth(year, month)
  const active = nurses.filter(n => n.active)
  const rn = active.filter(n => n.group === 'RN')
  const pn = active.filter(n => n.group === 'PN')
  const monthName = THAI_MONTHS[month - 1]

  const SUMMARY_COLS = ['O', 'D', 'N', 'S', 'ช', 'ลา', 'รวมเวร', 'ชม.']
  const totalCols = 3 + days + SUMMARY_COLS.length

  const cellStyle = 'border:1px solid #cbd5e1;text-align:center;font-size:11px;padding:2px 3px;'
  const headStyle = `${cellStyle}background:#f1f5f9;font-weight:bold;`

  const dayHeads = Array.from({ length: days }, (_, i) => {
    const d = i + 1
    const dow = thaiDow(year, month, d)
    const wknd = dow === 'ส' || dow === 'อา'
    return `<th style="${headStyle}${wknd ? 'background:#dbeafe;' : ''}"><div style="font-size:8px;color:#64748b">${dow}</div>${d}</th>`
  }).join('')

  const summaryHeads = SUMMARY_COLS.map(c => `<th style="${headStyle}background:#fef3c7;">${c}</th>`).join('')

  function nurseRow(n: Nurse, idx: number): string {
    const st = statsOf(schedule, n.id, days)
    const dayCells = Array.from({ length: days }, (_, i) => {
      const d = i + 1
      const s = (schedule[`${n.id}-${d}`] || '') as ShiftCode
      const style = SHIFT_STYLE[s] ?? SHIFT_STYLE['']
      const bg = style.label ? style.bg : '#ffffff'
      return `<td style="${cellStyle}background:${bg};color:${style.text || '#475569'}">${style.label || ''}</td>`
    }).join('')
    const sumCells = [st.O, st.D, st.N, st.S, st.CH, st.leave, st.work, st.hours]
      .map(v => `<td style="${cellStyle}background:#fffbeb;font-weight:bold">${v || ''}</td>`).join('')
    return `<tr>
      <td style="${cellStyle}">${idx + 1}</td>
      <td style="${cellStyle}text-align:left;white-space:nowrap;">${n.name}</td>
      <td style="${cellStyle}">${n.position}</td>
      ${dayCells}${sumCells}
    </tr>`
  }

  function groupHeader(label: string, count: number): string {
    return `<tr><td colspan="${totalCols}" style="${cellStyle}text-align:left;background:#e2e8f0;font-weight:bold;">${label} (${count} คน)</td></tr>`
  }

  // แถวรวมรายวัน — นับเฉพาะ roster ที่ส่งมา (RN หรือ PN) แยกกัน
  function daySummary(roster: Nurse[], tag: string, label: string, shifts: ShiftCode[]): string {
    const ros = roster.filter(n => n.position !== 'HOD')
    const cells = Array.from({ length: days }, (_, i) => {
      const d = i + 1
      const cnt = ros.filter(n => shifts.includes(schedule[`${n.id}-${d}`] as ShiftCode)).length
      return `<td style="${cellStyle}font-weight:bold;color:#475569">${cnt || ''}</td>`
    }).join('')
    return `<tr>
      <td colspan="3" style="${cellStyle}text-align:right;font-weight:bold;background:#f8fafc">${tag} · รวม ${label}</td>
      ${cells}<td colspan="${SUMMARY_COLS.length}" style="${cellStyle}background:#f8fafc"></td>
    </tr>`
  }

  return `
  <div style="font-family:'Sarabun','Tahoma',sans-serif;">
    <div style="font-size:16px;font-weight:bold;margin-bottom:6px;">
      ตารางเวรพยาบาล แผนก ${deptName} — ${monthName} ${year + 543}
    </div>
    <table style="border-collapse:collapse;">
      <thead>
        <tr>
          <th style="${headStyle}">ลำดับ</th>
          <th style="${headStyle}">ชื่อ-สกุล</th>
          <th style="${headStyle}">ตำแหน่ง</th>
          ${dayHeads}${summaryHeads}
        </tr>
      </thead>
      <tbody>
        ${rn.length ? groupHeader('RN พยาบาลวิชาชีพ', rn.length) : ''}
        ${rn.map((n, i) => nurseRow(n, i)).join('')}
        ${rn.length ? daySummary(rn, 'RN', 'D เวรเช้า', ['D', 'S']) : ''}
        ${rn.length ? daySummary(rn, 'RN', 'N เวรดึก', ['N']) : ''}
        ${rn.length ? daySummary(rn, 'RN', 'O หยุด', ['O']) : ''}
        ${pn.length ? groupHeader('PN พยาบาลเทคนิค', pn.length) : ''}
        ${pn.map((n, i) => nurseRow(n, i)).join('')}
        ${pn.length ? daySummary(pn, 'PN', 'D เวรเช้า', ['D', 'S']) : ''}
        ${pn.length ? daySummary(pn, 'PN', 'N เวรดึก', ['N']) : ''}
        ${pn.length ? daySummary(pn, 'PN', 'O หยุด', ['O']) : ''}
      </tbody>
    </table>
    <div style="margin-top:24px;font-size:12px;display:flex;gap:80px;">
      <div>ลงชื่อ.............................................ผู้จัดทำ</div>
      <div>ลงชื่อ.............................................ผู้ตรวจสอบ</div>
    </div>
  </div>`
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

// ── Excel export (.xls via HTML — opens in Excel, รองรับภาษาไทย) ──
export function exportExcel(data: ScheduleData, deptName: string) {
  const table = buildTableHTML(data, deptName)
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
    <head><meta charset="utf-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
    <x:Name>ตารางเวร</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
    </x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>
    <body>${table}</body></html>`
  const blob = new Blob(['﻿', html], { type: 'application/vnd.ms-excel;charset=utf-8' })
  triggerDownload(blob, `ตารางเวร_${deptName}_${THAI_MONTHS[data.month - 1]}_${data.year + 543}.xls`)
}

// ── PDF export (print window → Save as PDF) ───────────────────────
export function exportPDF(data: ScheduleData, deptName: string) {
  const table = buildTableHTML(data, deptName)
  const win = window.open('', '_blank')
  if (!win) {
    alert('กรุณาอนุญาต popup เพื่อสร้าง PDF')
    return
  }
  win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
    <title>ตารางเวร ${deptName}</title>
    <style>
      @page { size: A3 landscape; margin: 8mm; }
      body { margin: 0; }
      @media print { .noprint { display: none; } }
    </style>
    </head><body>
      <div class="noprint" style="padding:10px;text-align:center;font-family:sans-serif;">
        <button onclick="window.print()" style="padding:8px 24px;font-size:14px;background:#0d9488;color:#fff;border:none;border-radius:8px;cursor:pointer;">
          🖨 พิมพ์ / บันทึกเป็น PDF
        </button>
      </div>
      ${table}
      <script>window.onload = function(){ setTimeout(function(){ window.print() }, 400) }<\/script>
    </body></html>`)
  win.document.close()
}
