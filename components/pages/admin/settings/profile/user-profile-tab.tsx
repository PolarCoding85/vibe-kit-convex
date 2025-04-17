// components/pages/admin/settings/profile/user-profile-tab.tsx

import { format } from 'date-fns'
import { Check, X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

interface UserProfileTabProps {
  user: any // Using any for now to avoid type issues
  organizationsCount: number
}

export function UserProfileTab({
  user,
  organizationsCount
}: UserProfileTabProps) {
  // Handle both client-side and server-side data formats
  const userSince = user?.createdAt
    ? format(new Date(user.createdAt), 'MMMM dd, yyyy')
    : 'Unknown'
  const isActive = true // This would normally be fetched from your backend

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>
            Your personal information and account details
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div>
              <h3 className='text-sm font-medium text-gray-500'>First Name</h3>
              <p className='mt-1 text-sm'>
                {user?.firstName || 'Not provided'}
              </p>
            </div>
            <div>
              <h3 className='text-sm font-medium text-gray-500'>Last Name</h3>
              <p className='mt-1 text-sm'>{user?.lastName || 'Not provided'}</p>
            </div>
            <div>
              <h3 className='text-sm font-medium text-gray-500'>
                Email Address
              </h3>
              <p className='mt-1 text-sm'>
                {user?.primaryEmailAddress?.emailAddress || 
                 user?.emailAddresses?.[0]?.emailAddress || 
                 'Not provided'}
              </p>
            </div>
            <div>
              <h3 className='text-sm font-medium text-gray-500'>User Since</h3>
              <p className='mt-1 text-sm'>{userSince}</p>
            </div>
            <div>
              <h3 className='text-sm font-medium text-gray-500'>Status</h3>
              <div className='mt-1'>
                {isActive ? (
                  <Badge
                    variant='outline'
                    className='border-green-200 bg-green-50 text-green-700'
                  >
                    <Check className='mr-1 h-3 w-3' /> Active
                  </Badge>
                ) : (
                  <Badge
                    variant='outline'
                    className='border-red-200 bg-red-50 text-red-700'
                  >
                    <X className='mr-1 h-3 w-3' /> Disabled
                  </Badge>
                )}
              </div>
            </div>
            <div>
              <h3 className='text-sm font-medium text-gray-500'>
                Organizations
              </h3>
              <p className='mt-1 text-sm'>{organizationsCount}</p>
            </div>
          </div>

          <div className='flex justify-end space-x-2'>
            <Button>Edit Profile</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
