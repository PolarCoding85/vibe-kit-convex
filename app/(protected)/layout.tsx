// app/(protected)/layout.tsx

import { ProtectedSidebar } from '@/components/layout/protected/sidebar'
import { SiteHeader } from '@/components/pages/admin/dashboard/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default function ProtectedLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <ProtectedSidebar variant='inset' />
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
