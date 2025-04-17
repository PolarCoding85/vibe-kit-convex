// components/pages/admin/settings/team/team-members-tab-fixed.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { Protect } from '@clerk/nextjs'
import { Eye, MoreHorizontal, Trash, UserMinus } from 'lucide-react'

import { organizationRoles } from '@/lib/constants/organizations'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

// Define types to match the serialized data from page.tsx
type SerializedPublicUserData = {
  userId: string
  firstName?: string
  lastName?: string
  imageUrl?: string
  identifier: string
}

type SerializedMember = {
  id: string
  role: string
  status: 'active' | 'inactive'
  createdAt: number
  updatedAt: number
  publicUserData?: SerializedPublicUserData
}

interface TeamMembersTabProps {
  members: SerializedMember[]
}

export function TeamMembersTab({ members }: TeamMembersTabProps) {
  const [localMembers, setLocalMembers] = useState<SerializedMember[]>(members)
  const [deletingMember, setDeletingMember] = useState<string | null>(null)
  const [removingMember, setRemovingMember] = useState<string | null>(null)

  const handleRoleChange = async (memberId: string, newRole: string) => {
    try {
      // In a real implementation, this would call the Clerk API
      // await clerkClient.organizations.updateOrganizationMembership({
      //   organizationId: localMembers[0].organization.id,
      //   userId: memberId,
      //   role: newRole
      // })

      // For now, update locally
      setLocalMembers(prev =>
        prev.map(member =>
          member.publicUserData?.userId === memberId
            ? { ...(member as any), role: newRole }
            : member
        )
      )

      toast.success('Member role updated successfully')
    } catch (error) {
      console.error('Error updating member role:', error)
      toast.error('Failed to update member role')
    }
  }

  const handleStatusChange = async (
    memberId: string,
    newStatus: 'active' | 'inactive'
  ) => {
    try {
      // In a real implementation, this would call the Clerk API
      // const action = newStatus === 'active' ? 'enableOrganizationMembership' : 'disableOrganizationMembership'
      // await clerkClient.organizations[action]({
      //   organizationId: localMembers[0].organization.id,
      //   userId: memberId
      // })

      // For now, update locally
      setLocalMembers(prev =>
        prev.map(member =>
          member.publicUserData?.userId === memberId
            ? { ...(member as any), status: newStatus }
            : member
        )
      )

      toast.success(
        `Member ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`
      )
    } catch (error) {
      console.error('Error updating member status:', error)
      toast.error('Failed to update member status')
    }
  }

  const removeMember = async (memberId: string) => {
    try {
      // In a real implementation, this would call the Clerk API
      // await clerkClient.organizations.removeOrganizationMember({
      //   organizationId: localMembers[0].organization.id,
      //   userId: memberId
      // })

      // For now, update locally
      setLocalMembers(prev =>
        prev.filter(member => member.publicUserData?.userId !== memberId)
      )
      setRemovingMember(null)

      toast.success('Member removed from organization')
    } catch (error) {
      console.error('Error removing member:', error)
      toast.error('Failed to remove member')
    }
  }

  const deleteMember = async (memberId: string) => {
    try {
      // In a real implementation, this would call the Clerk API
      // await clerkClient.users.deleteUser(memberId)

      // For now, update locally
      setLocalMembers(prev =>
        prev.filter(member => member.publicUserData?.userId !== memberId)
      )
      setDeletingMember(null)

      toast.success('User deleted successfully')
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Failed to delete user')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>
          Manage people who have access to this team
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {localMembers.map(member => {
              if (!member.publicUserData) return null

              return (
                <TableRow key={member.publicUserData.userId}>
                  <TableCell>
                    <div className='flex items-center space-x-3'>
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
                        <p className='font-medium'>
                          {member.publicUserData.firstName}{' '}
                          {member.publicUserData.lastName}
                        </p>
                        <p className='text-muted-foreground text-sm'>
                          {member.publicUserData.identifier}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Protect
                      permission='org:team_settings:edit'
                      fallback={
                        <div className='text-muted-foreground rounded-md border px-4 py-2 text-sm'>
                          {member.role}
                        </div>
                      }
                    >
                      <Select
                        defaultValue={member.role}
                        onValueChange={value =>
                          handleRoleChange(member.publicUserData!.userId, value)
                        }
                      >
                        <SelectTrigger className='w-34'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {organizationRoles.map(role => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Protect>
                  </TableCell>
                  <TableCell>
                    <Protect
                      permission='org:team_settings:edit'
                      fallback={
                        <div className='text-muted-foreground flex items-center rounded-md border px-4 py-2 text-sm'>
                          <div
                            className={`mr-2 h-2 w-2 rounded-full ${member.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`}
                          />
                          {member.status === 'active' ? 'Active' : 'Inactive'}
                        </div>
                      }
                    >
                      <Select
                        defaultValue={member.status}
                        onValueChange={value =>
                          handleStatusChange(
                            member.publicUserData!.userId,
                            value as 'active' | 'inactive'
                          )
                        }
                      >
                        <SelectTrigger className='w-28'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='active'>
                            <div className='flex items-center'>
                              <div className='mr-2 h-2 w-2 rounded-full bg-green-500' />
                              Active
                            </div>
                          </SelectItem>
                          <SelectItem value='inactive'>
                            <div className='flex items-center'>
                              <div className='mr-2 h-2 w-2 rounded-full bg-gray-300' />
                              Inactive
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </Protect>
                  </TableCell>
                  <TableCell>
                    {format(new Date(member.createdAt), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell className='text-right'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon'>
                          <MoreHorizontal className='h-4 w-4' />
                          <span className='sr-only'>Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/admin/settings/team/${member.publicUserData.userId}`}
                          >
                            <Eye className='mr-2 h-4 w-4' />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <Protect permission='org:team_settings:edit'>
                          <DropdownMenuItem
                            onClick={() =>
                              setRemovingMember(member.publicUserData!.userId)
                            }
                            className='text-orange-600'
                          >
                            <UserMinus className='mr-2 h-4 w-4' />
                            Remove from Org
                          </DropdownMenuItem>
                        </Protect>
                        <Protect permission='org:team_settings:edit'>
                          <DropdownMenuItem
                            onClick={() =>
                              setDeletingMember(member.publicUserData!.userId)
                            }
                            className='text-red-600'
                          >
                            <Trash className='mr-2 h-4 w-4' />
                            Delete User
                          </DropdownMenuItem>
                        </Protect>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        {/* Remove Member Dialog */}
        <AlertDialog
          open={!!removingMember}
          onOpenChange={() => setRemovingMember(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove the member from your organization, but their
                account will remain active. They will lose access to all
                organization resources immediately.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => removingMember && removeMember(removingMember)}
                className='bg-orange-600 hover:bg-orange-700'
              >
                Remove Member
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete User Dialog */}
        <AlertDialog
          open={!!deletingMember}
          onOpenChange={() => setDeletingMember(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete User</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The user account will be
                permanently deleted from the system along with all of their
                data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deletingMember && deleteMember(deletingMember)}
                className='bg-red-600 hover:bg-red-700'
              >
                Delete User
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}
