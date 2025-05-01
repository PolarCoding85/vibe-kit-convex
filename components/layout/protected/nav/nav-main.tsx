'use client'

import { type LucideIcon, LayoutDashboardIcon, LibraryIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'

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
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboardIcon
  },
  {
    title: 'Reports',
    url: '/reports',
    icon: LibraryIcon
  }
]

// Check if the current path matches or is a subpath of the item's URL
function isActiveNavItem(itemUrl: string, pathname: string): boolean {
  if (itemUrl === '/') {
    return pathname === '/'
  }
  return pathname === itemUrl || pathname.startsWith(`${itemUrl}/`)
}

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
  const pathname = usePathname()
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel>System</SidebarGroupLabel>
      <SidebarGroupContent className='flex flex-col gap-2'>
        <SidebarMenu>
          {items.map(item => {
            const isActive = isActiveNavItem(item.url, pathname)
            
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  tooltip={item.title} 
                  asChild
                  data-active={isActive}
                  className={isActive ? 'bg-muted font-medium' : ''}
                >
                  <a href={item.url}>
                    {item.icon && <item.icon className={isActive ? 'text-primary' : ''} />}
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
