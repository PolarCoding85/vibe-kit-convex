'use client'

import { HomeIcon, FolderIcon, type LucideIcon } from 'lucide-react'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'

const defaultProtectedItems = [
  {
    title: 'Home',
    url: '/dashboard',
    icon: HomeIcon
  },
  {
    title: 'Documents',
    url: '/documents',
    icon: FolderIcon
  }
]

export function ProtectedNavMain({
  items = defaultProtectedItems
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
                <a href={item.url}>
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
