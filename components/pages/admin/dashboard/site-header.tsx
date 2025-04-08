// components/pages/admin/dashboard/site-header.tsx

'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { Notifications } from '@/components/ui/notifications'

// Helper function to capitalize string
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export function SiteHeader() {
  const pathname = usePathname()

  // Generate breadcrumb items based on pathname
  const pathSegments = pathname.split('/').filter(Boolean) // Split path and remove empty strings
  const breadcrumbItems = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/')
    const label = capitalize(segment.replace(/-/g, ' ')) // Capitalize and replace hyphens
    return { href, label }
  })

  // Add a 'Home' or root item if desired (optional)
  const items = [...breadcrumbItems]

  return (
    <header className='flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
      <div className='flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6'>
        <SidebarTrigger className='-ml-1' />
        <Separator
          orientation='vertical'
          className='mx-2 data-[orientation=vertical]:h-4'
        />
        <Breadcrumb className='hidden md:flex'>
          {' '}
          {/* Added hidden md:flex to hide on small screens initially */}
          <BreadcrumbList>
            {items.map((item, index) => (
              <React.Fragment key={item.href || item.label}>
                <BreadcrumbItem>
                  {index === items.length - 1 ? (
                    <BreadcrumbPage className='text-base font-medium'>
                      {item.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={item.href}>{item.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < items.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        <div className='ml-auto flex items-center gap-1'>
          <Notifications />
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
