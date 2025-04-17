// components/pages/admin/settings/organization/organization-details-tab.tsx

import { format } from 'date-fns'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

import type { Organization } from '@clerk/nextjs/server'

interface OrganizationDetailsTabProps {
  organization: Organization
}

export function OrganizationDetailsTab({
  organization
}: OrganizationDetailsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Details</CardTitle>
        <CardDescription>
          Information about your organization
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <div>
            <h3 className='text-sm font-medium text-gray-500'>
              Organization Name
            </h3>
            <p className='mt-1 text-sm'>{organization.name}</p>
          </div>
          <div>
            <h3 className='text-sm font-medium text-gray-500'>
              Organization Slug
            </h3>
            <p className='mt-1 text-sm'>{organization.slug}</p>
          </div>
          <div>
            <h3 className='text-sm font-medium text-gray-500'>
              Created Date
            </h3>
            <p className='mt-1 text-sm'>
              {format(new Date(organization.createdAt), 'MMMM dd, yyyy')}
            </p>
          </div>
          <div>
            <h3 className='text-sm font-medium text-gray-500'>
              Organization ID
            </h3>
            <p className='mt-1 text-sm'>{organization.id}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
