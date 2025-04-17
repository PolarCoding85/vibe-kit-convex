// components/pages/admin/settings/organization/organization-invitations-tab.tsx

import { format } from 'date-fns'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

import type { OrganizationInvitation } from '@clerk/nextjs/server'

interface OrganizationInvitationsTabProps {
  invitations: OrganizationInvitation[]
}

export function OrganizationInvitationsTab({
  invitations
}: OrganizationInvitationsTabProps) {
  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-medium'>Invitations</h3>
          <p className='text-muted-foreground text-sm'>
            Manage your organization invitations
          </p>
        </div>
        <Button variant='default'>Invite user</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Invited</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invitations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className='text-center'>
                No pending invitations
              </TableCell>
            </TableRow>
          ) : (
            invitations.map((invitation) => {
              if (!invitation.emailAddress || !invitation.status) return null

              return (
                <TableRow key={invitation.id}>
                  <TableCell>{invitation.emailAddress}</TableCell>
                  <TableCell>
                    <Badge
                      variant='outline'
                      className='border-yellow-200 bg-yellow-50 text-yellow-700'
                    >
                      {invitation.status}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-muted-foreground'>
                    {format(new Date(invitation.createdAt), 'MMM d, yyyy')}
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
