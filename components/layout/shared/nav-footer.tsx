// components/layout/shared/nav-footer.tsx

'use client'

import * as React from 'react'
import { LucideIcon } from 'lucide-react'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'

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
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map(item => (
            <SidebarMenuItem
              key={item.title}
            >
              <SidebarMenuButton
                tooltip={item.title}
                asChild
              >
                <a href={item.url} target={item.target} rel={item.rel}>
                  <item.icon />
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
