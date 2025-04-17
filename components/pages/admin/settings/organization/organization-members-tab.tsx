// components/pages/admin/settings/organization/organization-members-tab.tsx

import { format } from 'date-fns'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

import type { OrganizationMembership } from '@clerk/nextjs/server'

interface OrganizationMembersTabProps {
  members: OrganizationMembership[]
}

export function OrganizationMembersTab({ members }: OrganizationMembersTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Members</CardTitle>
        <CardDescription>
          People who have access to this organization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {members.map((member) => {
            if (!member.publicUserData) return null
            
            return (
              <div
                key={member.publicUserData.userId}
                className='flex items-center justify-between rounded-lg border p-4'
              >
                <div className='flex flex-1 items-center space-x-4'>
                  <Avatar>
                    <AvatarImage
                      src={member.publicUserData.imageUrl ?? undefined}
                      alt={member.publicUserData.firstName ?? ''}
                    />
                    <AvatarFallback>
                      {member.publicUserData.firstName?.[0]}
                      {member.publicUserData.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className='font-medium'>
                      {member.publicUserData.firstName}{' '}
                      {member.publicUserData.lastName}
                    </h3>
                    <p className='text-muted-foreground text-sm'>
                      {member.publicUserData.identifier}
                    </p>
                    <div className='mt-1 flex items-center space-x-2'>
                      <Badge variant='secondary'>{member.role}</Badge>
                      <span className='text-muted-foreground text-xs'>
                        Joined{' '}
                        {format(
                          new Date(member.createdAt),
                          'MMMM dd, yyyy'
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
