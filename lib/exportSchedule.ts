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

const SUMMARY_COLS = ['O', 'D', 'N', 'S', 'ช', 'ลา', 'รวมเวร', 'ชม.']

// ── Build ONE group's table (RN หรือ PN) — มีหัวเรื่อง + หัวตาราง + สรุปของตัวเอง ──
// ทำเป็น <table> เดียวจบในตัว เพื่อให้เป็น 1 worksheet (Excel) / 1 หน้า (PDF)
function buildGroupTable(
  data: ScheduleData, deptName: string,
  group: Nurse[], groupTitle: string, tag: string,
): string {
  const { year, month, schedule } = data
  const days = daysInMonth(year, month)
  const monthName = THAI_MONTHS[month - 1]
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

  function daySummary(label: string, shifts: ShiftCode[]): string {
    const ros = group.filter(n => n.position !== 'HOD')
    const cells = Array.from({ length: days }, (_, i) => {
      const d = i + 1
      const cnt = ros.filter(n => shifts.includes(schedule[`${n.id}-${d}`] as ShiftCode)).length
      return `<td style="${cellStyle}font-weight:bold;color:#475569">${cnt || ''}</td>`
    }).join('')
    return `<tr>
      <td colspan="3" style="${cellStyle}text-align:right;font-weight:bold;background:#f8fafc">รวม ${label}</td>
      ${cells}<td colspan="${SUMMARY_COLS.length}" style="${cellStyle}background:#f8fafc"></td>
    </tr>`
  }

  return `<table style="border-collapse:collapse;font-family:'Sarabun','Tahoma',sans-serif;">
    <tr><td colspan="${totalCols}" style="border:none;font-size:16px;font-weight:bold;padding:4px 2px;text-align:left;">
      ตารางเวรพยาบาล แผนก ${deptName} — ${groupTitle} — ${monthName} ${year + 543}
    </td></tr>
    <thead>
      <tr>
        <th style="${headStyle}">ลำดับ</th>
        <th style="${headStyle}">ชื่อ-สกุล</th>
        <th style="${headStyle}">ตำแหน่ง</th>
        ${dayHeads}${summaryHeads}
      </tr>
    </thead>
    <tbody>
      ${group.map((n, i) => nurseRow(n, i)).join('')}
      ${daySummary('D เวรเช้า', ['D', 'S'])}
      ${daySummary('N เวรดึก', ['N'])}
      ${daySummary('O หยุด', ['O'])}
      <tr><td colspan="${totalCols}" style="border:none;height:26px;"></td></tr>
      <tr>
        <td colspan="${Math.ceil(totalCols / 2)}" style="border:none;font-size:12px;padding-top:8px;">ลงชื่อ.............................................ผู้จัดทำ</td>
        <td colspan="${Math.floor(totalCols / 2)}" style="border:none;font-size:12px;padding-top:8px;">ลงชื่อ.............................................ผู้ตรวจสอบ</td>
      </tr>
    </tbody>
  </table>`
}

function groupTables(data: ScheduleData, deptName: string): { rn: string; pn: string } {
  const active = data.nurses.filter(n => n.active)
  const rn = active.filter(n => n.group === 'RN')
  const pn = active.filter(n => n.group === 'PN')
  return {
    rn: buildGroupTable(data, deptName, rn, 'RN พยาบาลวิชาชีพ', 'RN'),
    pn: buildGroupTable(data, deptName, pn, 'PN พยาบาลเทคนิค', 'PN'),
  }
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

// ── Excel export — RN และ PN เป็นคนละชีต ──
export function exportExcel(data: ScheduleData, deptName: string) {
  const { rn, pn } = groupTables(data, deptName)
  const sheet = (name: string) =>
    `<x:ExcelWorksheet><x:Name>${name}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>`
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
    <head><meta charset="utf-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets>
    ${sheet('RN')}${sheet('PN')}
    </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>
    <body>${rn}${pn}</body></html>`
  const blob = new Blob(['﻿', html], { type: 'application/vnd.ms-excel;charset=utf-8' })
  triggerDownload(blob, `ตารางเวร_${deptName}_${THAI_MONTHS[data.month - 1]}_${data.year + 543}.xls`)
}

// ── PDF export — RN และ PN คนละหน้า (page-break) ──
export function exportPDF(data: ScheduleData, deptName: string) {
  const { rn, pn } = groupTables(data, deptName)
  const win = window.open('', '_blank')
  if (!win) {
    alert('กรุณาอนุญาต popup เพื่อสร้าง PDF')
    return
  }
  win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
    <title>ตารางเวร ${deptName}</title>
    <style>
      @page { size: A3 landscape; margin: 8mm; }
      body { margin: 0; font-family: 'Sarabun','Tahoma',sans-serif; }
      .page { page-break-after: always; }
      .page:last-child { page-break-after: auto; }
      @media print { .noprint { display: none; } }
    </style>
    </head><body>
      <div class="noprint" style="padding:10px;text-align:center;">
        <button onclick="window.print()" style="padding:8px 24px;font-size:14px;background:#0d9488;color:#fff;border:none;border-radius:8px;cursor:pointer;">
          🖨 พิมพ์ / บันทึกเป็น PDF (RN + PN คนละหน้า)
        </button>
      </div>
      <div class="page">${rn}</div>
      <div class="page">${pn}</div>
      <script>window.onload = function(){ setTimeout(function(){ window.print() }, 400) }<\/script>
    </body></html>`)
  win.document.close()
}
