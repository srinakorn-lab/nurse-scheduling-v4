import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ variable: '--font-geist', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ระบบจัดตารางเวรพยาบาล',
  description: 'Nurse Scheduling System — CCU / NCU / ICU',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${geist.variable} h-full`}>
      <body className="min-h-full bg-gray-50 text-gray-900 antialiased font-[family-name:var(--font-geist)]">
        {children}
      </body>
    </html>
  )
}
