// components/layout/shared/nav-footer.tsx

'use client'

import * as React from 'react'
import { LucideIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'

// Check if the current path matches or is a subpath of the item's URL
function isActiveNavItem(itemUrl: string, pathname: string): boolean {
  if (itemUrl === '/') {
    return pathname === '/'
  }
  return pathname === itemUrl || pathname.startsWith(`${itemUrl}/`)
}

export function NavFooter({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    target?: string
    rel?: string
  }[]
} & React.ComponentPropsWithoutRef<
  typeof SidebarGroup
>) {
  const pathname = usePathname()

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map(item => {
            const isActive = isActiveNavItem(item.url, pathname)
            
            return (
              <SidebarMenuItem
                key={item.title}
              >
                <SidebarMenuButton
                  tooltip={item.title}
                  asChild
                  data-active={isActive}
                  className={isActive ? 'bg-muted font-medium' : ''}
                >
                  <a href={item.url} target={item.target} rel={item.rel}>
                    <item.icon className={isActive ? 'text-primary' : ''} />
                    <span>
                      {item.title}
                    </span>
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
