'use client'

import {
  LayoutDashboardIcon,
  UsersIcon,
  type LucideIcon,
  Building2Icon
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
    url: '/admin/dashboard',
    icon: LayoutDashboardIcon
  },
  {
    title: 'Organizations',
    url: '/admin/organizations',
    icon: Building2Icon
  },
  {
    title: 'Users',
    url: '/admin/users',
    icon: UsersIcon
  }
]

export function AdminNavMain({
  items = defaultAdminItems
}: {
  items?: {
    title: string
    url: string
    icon?: LucideIcon
    target?: string
    rel?: string
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>System</SidebarGroupLabel>
      <SidebarGroupContent className='flex flex-col gap-2'>
        <SidebarMenu>
          {items.map(item => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title} asChild>
                <a href={item.url} target={item.target} rel={item.rel}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
