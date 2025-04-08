// app/(protected)/dashboard/page.tsx

import { ChartAreaInteractive } from '@/components/pages/admin/dashboard/chart-area-interactive'
import { DataTable } from '@/components/pages/admin/dashboard/data-table'
import { SectionCards } from '@/components/pages/admin/dashboard/section-cards'

import data from '@/lib/data.json'

export default function Page() {
  return (
    <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
      <SectionCards />
      <div className='px-4 lg:px-6'>
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} />
    </div>
  )
}
