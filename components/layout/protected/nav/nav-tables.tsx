'use client'

import {
  type LucideIcon,
  ShieldCheckIcon,
  Users2Icon,
  HeadsetIcon
} from 'lucide-react'
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
    title: 'Audits',
    url: '/audits',
    icon: ShieldCheckIcon
  },
  {
    title: 'Contacts',
    url: '/contacts',
    icon: Users2Icon
  },
  {
    title: 'Agents',
    url: '/agents',
    icon: HeadsetIcon
  }
]

// Check if the current path matches or is a subpath of the item's URL
function isActiveNavItem(itemUrl: string, pathname: string): boolean {
  if (itemUrl === '/') {
    return pathname === '/'
  }
  return pathname === itemUrl || pathname.startsWith(`${itemUrl}/`)
}

export function ProtectedNavTables({
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
      <SidebarGroupLabel>Tables</SidebarGroupLabel>
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
