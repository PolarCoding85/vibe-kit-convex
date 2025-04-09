'use client'

import * as React from 'react'
import {
  ClipboardListIcon,
  DatabaseIcon,
  HeartHandshakeIcon,
  HelpCircleIcon,
  SettingsIcon
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

export function ProtectedSidebar({
  ...props
}: React.ComponentProps<
  typeof Sidebar
>) {
  return (
    <Sidebar
      collapsible='icon'
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className='data-[slot=sidebar-menu-button]:!p-1.5'
            >
              <a href='/dashboard'>
                <HeartHandshakeIcon className='text-primary h-5 w-5' />
                <span className='text-base font-semibold'>
                  Vibe Kits
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <ProtectedNavMain />
        <NavSecondary
          label='Documents'
          items={[
            {
              name: 'Data Library',
              url: '/documents/data',
              icon: DatabaseIcon
            },
            {
              name: 'Reports',
              url: '/documents/reports',
              icon: ClipboardListIcon
            }
          ]}
        />
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
        <NavUser
          user={{
            name: 'User',
            email: 'user@example.com',
            avatar: '/avatars/user.jpg'
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
