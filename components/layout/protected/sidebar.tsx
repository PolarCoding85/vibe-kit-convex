'use client'

import * as React from 'react'
import {
  ClipboardListIcon,
  DatabaseIcon,
  HeartHandshakeIcon,
  HelpCircleIcon,
  SettingsIcon,
  ShieldCheckIcon
} from 'lucide-react'

import { NavSecondary } from '@/components/layout/shared/nav-secondary'
import { NavFooter } from '@/components/layout/shared/nav-footer'
import { NavUser } from '@/components/layout/shared/nav-user'
import { ProtectedNavMain } from '@/components/layout/protected/nav/nav-main'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { ProtectedNavTools } from './nav/nav-tools'
import { ProtectedNavTables } from './nav/nav-tables'

export function ProtectedSidebar({
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
              <a href='/dashboard'>
                <ShieldCheckIcon className='text-primary h-5 w-5' />
                <span className='text-base font-semibold'>
                  call<span className='text-primary'>adhere</span>
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <ProtectedNavMain />
        <ProtectedNavTools />
        <ProtectedNavTables />
        <NavFooter
          className='mt-auto'
          items={[
            {
              title: 'Settings',
              url: '/settings',
              icon: SettingsIcon
            },
            {
              title: 'Get Help',
              url: '/help',
              icon: HelpCircleIcon
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
