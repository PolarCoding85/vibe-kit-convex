'use client'

import * as React from 'react'
import { Bell } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { dummyNotifications } from '@/lib/notifications'

type Tab = 'all' | 'archive'

export function Notifications() {
  const [activeTab, setActiveTab] = React.useState<Tab>('all')
  const unreadCount = dummyNotifications.filter(n => !n.read).length
  const filteredNotifications = dummyNotifications.filter(n =>
    activeTab === 'all' ? !n.archived : n.archived
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='relative'>
          <Bell className='h-5 w-5' />
          {unreadCount > 0 && (
            <span className='bg-primary absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs'>
              {unreadCount}
            </span>
          )}
          <span className='sr-only'>View Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[440px]'>
        <div className='flex items-center justify-between border-b px-4 py-2'>
          <h2 className='text-sm font-semibold'>Notifications</h2>
          <div className='flex gap-1'>
            <Button
              variant={activeTab === 'all' ? 'secondary' : 'ghost'}
              size='sm'
              className='text-xs'
              onClick={() => setActiveTab('all')}
            >
              All
              <span className='bg-muted ml-1 rounded px-1'>
                {dummyNotifications.filter(n => !n.archived).length}
              </span>
            </Button>
            <Button
              variant={activeTab === 'archive' ? 'secondary' : 'ghost'}
              size='sm'
              className='text-xs'
              onClick={() => setActiveTab('archive')}
            >
              Archive
              <span className='bg-muted ml-1 rounded px-1'>
                {dummyNotifications.filter(n => n.archived).length}
              </span>
            </Button>
          </div>
        </div>
        <div className='max-h-[300px] overflow-y-auto'>
          {filteredNotifications.length === 0 ? (
            <div className='text-muted-foreground p-4 text-center text-sm'>
              No notifications
            </div>
          ) : (
            filteredNotifications.map(notification => (
              <DropdownMenuItem
                key={notification.id}
                className='flex flex-col items-start gap-1 p-4'
              >
                <div className='flex w-full items-start justify-between gap-2'>
                  <p className='text-sm'>{notification.message}</p>
                  {!notification.read && (
                    <span
                      className={`h-2 w-2 rounded-full ${notification.archived ? 'bg-muted-foreground' : 'bg-primary'}`}
                    />
                  )}
                </div>
                <p className='text-muted-foreground text-xs'>
                  {formatDistanceToNow(notification.timestamp, {
                    addSuffix: true
                  })}
                </p>
              </DropdownMenuItem>
            ))
          )}
        </div>
        <div className='border-t p-2'>
          <div className='flex items-center justify-between gap-2'>
            {unreadCount > 0 && (
              <Button variant='ghost' size='sm' className='w-full text-xs'>
                Mark all as read
              </Button>
            )}
            <Button variant='ghost' size='sm' className='w-full text-xs'>
              View all notifications
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
