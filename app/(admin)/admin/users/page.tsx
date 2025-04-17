// app/(admin)/admin/users/page.tsx

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

// Function to fetch all users from Clerk
async function getData() {
  try {
    // Initialize the Clerk client
    const clerk = await clerkClient()

    // Fetch all users
    // You can use pagination parameters like limit and offset if needed
    const users = await clerk.users.getUserList({
      limit: 100 // Adjust based on your needs
    })

    return { users: users.data }
  } catch (error) {
    console.error('Error fetching users:', error)
    return { users: [] }
  }
}

export default async function UsersPage() {
  // Ensure the user is authenticated
  await auth()

  // Fetch all users
  const { users } = await getData()

  return (
    <div className='container mx-auto p-6'>
      <AdminPageHeader
        title='Users'
        description='Manage and view all users registered in your application.'
      />

      <Card className='mt-6'>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            A list of all users registered with your application via Clerk.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Sign In</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className='flex items-center gap-3'>
                      <Avatar className='h-9 w-9'>
                        <AvatarImage
                          src={user.imageUrl}
                          alt={user.firstName || ''}
                        />
                        <AvatarFallback className='text-xs'>
                          {user.firstName?.[0]}
                          {user.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className='font-medium'>
                          {user.firstName} {user.lastName}
                        </p>
                        <p className='text-muted-foreground text-xs'>
                          {user.username || user.id.substring(0, 8)}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.emailAddresses?.[0]?.emailAddress || 'No email'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.publicMetadata?.banned
                          ? 'destructive'
                          : user.publicMetadata?.deactivated
                            ? 'outline'
                            : 'default'
                      }
                    >
                      {user.publicMetadata?.banned
                        ? 'Banned'
                        : user.publicMetadata?.deactivated
                          ? 'Inactive'
                          : 'Active'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.createdAt
                      ? format(new Date(user.createdAt), 'MMM d, yyyy')
                      : 'Unknown'}
                  </TableCell>
                  <TableCell>
                    {user.lastSignInAt
                      ? format(new Date(user.lastSignInAt), 'MMM d, yyyy')
                      : 'Never'}
                  </TableCell>
                </TableRow>
              ))}

              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className='h-24 text-center'>
                    No users found.
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
