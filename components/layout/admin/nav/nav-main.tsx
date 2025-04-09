'use client'

import {
  LayoutDashboardIcon,
  UsersIcon,
  SettingsIcon,
  type LucideIcon
} from 'lucide-react'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'

const defaultAdminItems = [
  {
    title: 'Dashboard',
    url: '/admin',
    icon: LayoutDashboardIcon
  },
  {
    title: 'Users',
    url: '/admin/users',
    icon: UsersIcon
  },
  {
    title: 'Settings',
    url: '/admin/settings',
    icon: SettingsIcon
  }
]

export function AdminNavMain({
  items = defaultAdminItems
}: {
  items?: {
    title: string
    url: string
    icon?: LucideIcon
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        System
      </SidebarGroupLabel>
      <SidebarGroupContent className='flex flex-col gap-2'>
        <SidebarMenu>
          {items.map(item => (
            <SidebarMenuItem
              key={item.title}
            >
              <SidebarMenuButton
                tooltip={item.title}
                asChild
              >
                <a href={item.url}>
                  {item.icon && (
                    <item.icon />
                  )}
                  <span>
                    {item.title}
                  </span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
