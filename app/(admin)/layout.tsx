// app/(admin)/layout.tsx

import { AppSidebar } from '@/components/layout/sidebar'
import { SiteHeader } from '@/components/pages/admin/dashboard/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar variant='inset' />
      <SidebarInset>
        <SiteHeader />
        <div className='flex flex-1 flex-col'>
          <div className='@container/main flex flex-1 flex-col gap-2'>
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
