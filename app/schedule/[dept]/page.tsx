import { DEPT_LIST } from '@/lib/constants'
import SchedulePageClient from '@/components/SchedulePageClient'

export function generateStaticParams() {
  return DEPT_LIST.map(d => ({ dept: d.id.toLowerCase() }))
}

export default async function SchedulePage({ params }: { params: Promise<{ dept: string }> }) {
  const { dept } = await params
  return <SchedulePageClient deptParam={dept} />
}
