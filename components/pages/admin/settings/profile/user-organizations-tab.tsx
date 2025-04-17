// components/pages/admin/settings/profile/user-organizations-tab.tsx
'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Building, Loader2, Check, Trash2, Save } from 'lucide-react'
import Image from 'next/image'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { toast } from 'sonner'
import {
  updateOrganizationMembershipRole,
  deleteOrganizationMembership
} from '@/app/api/organization/actions'
import { organizationRoles } from '@/lib/constants/organizations'

interface OrganizationMembership {
  id: string
  name: string
  imageUrl?: string
  createdAt?: string | number | Date
  role: string
  organization?: {
    id: string
    name: string
    imageUrl?: string
    createdAt?: string | number | Date
  }
}

interface UserOrganizationsTabProps {
  organizationList: OrganizationMembership[] | null | undefined
  isLoaded: boolean
  userId?: string
}

// Helper function to format role name
const formatRoleName = (role: string): string => {
  return role
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export function UserOrganizationsTab({
  organizationList,
  isLoaded,
  userId
}: UserOrganizationsTabProps) {
  // Using sonner for toast notifications
  const [updatingRoles, setUpdatingRoles] = useState<Record<string, boolean>>(
    {}
  )
  const [deletingMemberships, setDeletingMemberships] = useState<
    Record<string, boolean>
  >({})
  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Your Organizations</CardTitle>
          <CardDescription>Organizations you are a member of</CardDescription>
        </CardHeader>
        <CardContent>
          {!isLoaded ? (
            <div className='flex items-center justify-center py-8'>
              <Loader2 className='text-primary h-8 w-8 animate-spin' />
              <span className='ml-2'>Loading organizations...</span>
            </div>
          ) : organizationList && organizationList.length > 0 ? (
            <div className='space-y-4'>
              {organizationList.map(membership => {
                // Handle both client-side and server-side data formats
                const orgId = membership.organization?.id || membership.id
                const orgName = membership.organization?.name || membership.name
                const orgImageUrl =
                  membership.organization?.imageUrl || membership.imageUrl
                const orgCreatedAt =
                  membership.organization?.createdAt || membership.createdAt
                const role = membership.role

                return (
                  <div
                    key={orgId}
                    className='flex items-center justify-between rounded-lg border p-4'
                  >
                    <div className='flex flex-1 items-center space-x-4'>
                      <div className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full'>
                        {orgImageUrl ? (
                          <Image
                            src={orgImageUrl}
                            alt={orgName}
                            width={40}
                            height={40}
                            className='h-10 w-10 rounded-full object-cover'
                          />
                        ) : (
                          <Building className='text-primary h-5 w-5' />
                        )}
                      </div>
                      <div>
                        <h3 className='font-medium'>{orgName}</h3>
                        <div className='flex items-center space-x-2'>
                          <Badge variant='secondary'>
                            {formatRoleName(role)}
                          </Badge>
                          <span className='text-muted-foreground text-xs'>
                            Member since{' '}
                            {orgCreatedAt
                              ? (() => {
                                  try {
                                    return format(
                                      new Date(orgCreatedAt),
                                      'MMM yyyy'
                                    )
                                  } catch {
                                    return 'Unknown'
                                  }
                                })()
                              : 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      {userId && (
                        <div className='flex items-center gap-2'>
                          <form
                            action={async formData => {
                              try {
                                setUpdatingRoles(prev => ({
                                  ...prev,
                                  [orgId]: true
                                }))
                                const result =
                                  await updateOrganizationMembershipRole(
                                    formData
                                  )

                                if (result.success) {
                                  toast.success('Success', {
                                    description: result.message
                                  })
                                } else {
                                  toast.error('Error', {
                                    description: result.message
                                  })
                                }
                              } catch {
                                toast.error('Error', {
                                  description: 'Failed to update role'
                                })
                              } finally {
                                setUpdatingRoles(prev => ({
                                  ...prev,
                                  [orgId]: false
                                }))
                              }
                            }}
                            className='flex items-center gap-2'
                          >
                            <input
                              type='hidden'
                              name='organizationId'
                              value={orgId}
                            />
                            <input type='hidden' name='userId' value={userId} />

                            <Select name='role' defaultValue={role}>
                              <SelectTrigger className='w-[130px]' size='sm'>
                                <SelectValue placeholder='Select role' />
                              </SelectTrigger>
                              <SelectContent>
                                {organizationRoles.map(
                                  (roleOption: {
                                    value: string
                                    label: string
                                  }) => (
                                    <SelectItem
                                      key={roleOption.value}
                                      value={roleOption.value}
                                    >
                                      {roleOption.label}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  type='submit'
                                  size='sm'
                                  variant='outline'
                                  disabled={updatingRoles[orgId]}
                                >
                                  {updatingRoles[orgId] ? (
                                    <Loader2 className='h-4 w-4 animate-spin' />
                                  ) : (
                                    <Save className='h-4 w-4' />
                                  )}
                                  <span className='sr-only'>Update Role</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Confirm changes</p>
                              </TooltipContent>
                            </Tooltip>
                          </form>

                          <form
                            action={async formData => {
                              try {
                                if (
                                  !confirm(
                                    'Are you sure you want to leave this organization?'
                                  )
                                ) {
                                  return
                                }

                                setDeletingMemberships(prev => ({
                                  ...prev,
                                  [orgId]: true
                                }))

                                const result =
                                  await deleteOrganizationMembership(formData)

                                if (result.success) {
                                  toast.success('Success', {
                                    description: result.message
                                  })
                                } else {
                                  toast.error('Error', {
                                    description: result.message
                                  })
                                }
                              } catch {
                                toast.error('Error', {
                                  description: 'Failed to leave organization'
                                })
                              } finally {
                                setDeletingMemberships(prev => ({
                                  ...prev,
                                  [orgId]: false
                                }))
                              }
                            }}
                            className='flex items-center'
                          >
                            <input
                              type='hidden'
                              name='organizationId'
                              value={orgId}
                            />
                            <input type='hidden' name='userId' value={userId} />

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  type='submit'
                                  size='sm'
                                  variant='outline'
                                  className='text-destructive hover:text-destructive'
                                  disabled={deletingMemberships[orgId]}
                                >
                                  {deletingMemberships[orgId] ? (
                                    <Loader2 className='h-4 w-4 animate-spin' />
                                  ) : (
                                    <Trash2 className='h-4 w-4' />
                                  )}
                                  <span className='sr-only'>
                                    Leave Organization
                                  </span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Remove from organization</p>
                              </TooltipContent>
                            </Tooltip>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className='py-8 text-center'>
              <p className='text-muted-foreground'>
                You are not a member of any organizations.
              </p>
              <Button className='mt-4' variant='outline'>
                Create Organization
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
