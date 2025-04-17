'use client'

import * as React from 'react'
import { HeartHandshakeIcon, Library, SettingsIcon } from 'lucide-react'

import { AdminNavMain } from '@/components/layout/admin/nav/nav-main'
import { NavUser } from '@/components/layout/shared/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { NavFooter } from '@/components/layout/shared/nav-footer'

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className='data-[slot=sidebar-menu-button]:!p-1.5'
            >
              <a href='/admin/dashboard'>
                <HeartHandshakeIcon className='text-primary h-5 w-5' />
                <span className='text-base font-semibold'>Admin Panel</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <AdminNavMain />
        <NavFooter
          className='mt-auto'
          items={[
            {
              title: 'Settings',
              url: '/admin/settings',
              icon: SettingsIcon
            },
            {
              title: 'Docs',
              url: '/docs',
              icon: Library,
              target: '_blank',
              rel: 'noopener noreferrer'
            }
          ]}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
