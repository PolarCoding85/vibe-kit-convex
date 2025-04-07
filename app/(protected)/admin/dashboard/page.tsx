// app/(protected)/admin/dashboard/page.tsx

import { AppSidebar } from '@/components/layout/sidebar'
import { ChartAreaInteractive } from '@/components/pages/admin/dashboard/chart-area-interactive'
import { DataTable } from '@/components/pages/admin/dashboard/data-table'
import { SectionCards } from '@/components/pages/admin/dashboard/section-cards'
import { SiteHeader } from '@/components/pages/admin/dashboard/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

import data from '@/lib/data.json'

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar variant='inset' />
      <SidebarInset>
        <SiteHeader />
        <div className='flex flex-1 flex-col'>
          <div className='@container/main flex flex-1 flex-col gap-2'>
            <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
              <SectionCards />
              <div className='px-4 lg:px-6'>
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
