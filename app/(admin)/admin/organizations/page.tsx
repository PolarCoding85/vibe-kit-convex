// app/(admin)/admin/organizations/page.tsx

import { auth } from '@clerk/nextjs/server'
import { clerkClient } from '@clerk/nextjs/server'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

import { AdminPageHeader } from '@/components/layout/admin/admin-page-header'

// Function to fetch all organizations from Clerk
async function getData() {
  try {
    // Initialize the Clerk client
    const clerk = await clerkClient()

    // Fetch all organizations
    const organizations = await clerk.organizations.getOrganizationList({
      limit: 100 // Adjust based on your needs
    })

    return { organizations: organizations.data }
  } catch (error) {
    console.error('Error fetching organizations:', error)
    return { organizations: [] }
  }
}

export default async function OrganizationsPage() {
  // Ensure the user is authenticated
  await auth()

  // Fetch all organizations
  const { organizations } = await getData()

  return (
    <div className='container mx-auto p-6'>
      <AdminPageHeader
        title='Organizations'
        description='Manage and view all organizations in your application.'
      />

      <Card className='mt-6'>
        <CardHeader>
          <CardTitle>All Organizations</CardTitle>
          <CardDescription>
            A list of all organizations registered with your application via
            Clerk.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizations.map(organization => (
                <TableRow key={organization.id}>
                  <TableCell>
                    <div className='flex items-center gap-3'>
                      <Avatar className='h-9 w-9'>
                        <AvatarImage
                          src={organization.imageUrl}
                          alt={organization.name || ''}
                        />
                        <AvatarFallback className='text-xs'>
                          {organization.name?.substring(0, 2).toUpperCase() ||
                            'ORG'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className='font-medium'>{organization.name}</p>
                        <p className='text-muted-foreground text-xs'>
                          {organization.id.substring(0, 8)}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {organization.membersCount || 0} members
                  </TableCell>
                  <TableCell>
                    {organization.createdAt
                      ? format(new Date(organization.createdAt), 'MMM d, yyyy')
                      : 'Unknown'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        organization.publicMetadata?.suspended
                          ? 'outline'
                          : 'default'
                      }
                    >
                      {organization.publicMetadata?.suspended
                        ? 'Suspended'
                        : 'Active'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}

              {organizations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className='h-24 text-center'>
                    No organizations found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
