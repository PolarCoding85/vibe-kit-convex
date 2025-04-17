// app/(admin)/admin/settings/profile/page.tsx

import { auth, currentUser } from '@clerk/nextjs/server'
import { clerkClient } from '@clerk/nextjs/server'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { ProfileLoadingSkeleton } from '@/components/pages/admin/settings/profile/profile-loading-skeleton'
import { UserProfileTab } from '@/components/pages/admin/settings/profile/user-profile-tab'
import { UserOrganizationsTab } from '@/components/pages/admin/settings/profile/user-organizations-tab'

// Fetch user and organization data server-side
async function getData() {
  const { userId } = await auth()

  if (!userId) {
    return { user: null, organizations: [] }
  }

  // Get the current user
  const user = await currentUser()

  // Fetch organization memberships from the Clerk API
  let organizations: {
    id: string
    name: string
    role: string
    imageUrl?: string
    createdAt?: string | number
  }[] = []

  try {
    // Get the user's organization memberships using Clerk API
    // Initialize the clerk client first
    const clerk = await clerkClient()
    const response = await clerk.users.getOrganizationMembershipList({
      userId
    })

    // Map the response data to our expected format
    organizations = response.data.map((membership) => ({
      id: membership.organization.id,
      name: membership.organization.name,
      role: membership.role,
      imageUrl:
        membership.organization.imageUrl ||
        `https://api.dicebear.com/6.x/initials/svg?seed=${membership.organization.name.substring(0, 2)}`,
      createdAt: membership.createdAt
    }))
  } catch (error) {
    console.error('Error fetching organization memberships:', error)
    // Return empty array in case of error
    organizations = []
  }

  return {
    user,
    organizations
  }
}

export default async function ProfilePage() {
  const { userId } = await auth()
  const { user, organizations } = await getData()

  if (!user) {
    return <ProfileLoadingSkeleton />
  }

  return (
    <div className='container p-8'>
      <div className='mx-auto max-w-4xl'>
        <div className='mb-6 flex items-center space-x-4'>
          <Avatar className='h-20 w-20'>
            <AvatarImage src={user.imageUrl} alt={user.fullName || ''} />
            <AvatarFallback className='text-lg'>
              {user.firstName?.charAt(0)}
              {user.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className='text-2xl font-bold'>{user.fullName}</h1>
            <p className='text-muted-foreground'>
              {user.emailAddresses[0]?.emailAddress}
            </p>
          </div>
        </div>

        <Tabs defaultValue='profile' className='w-full'>
          <TabsList className='mb-6'>
            <TabsTrigger value='profile'>Profile</TabsTrigger>
            <TabsTrigger value='organizations'>
              Organizations ({organizations.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value='profile' className='space-y-6'>
            <UserProfileTab
              user={user}
              organizationsCount={organizations.length}
            />
          </TabsContent>

          <TabsContent value='organizations' className='space-y-6'>
            <UserOrganizationsTab
              organizationList={organizations}
              isLoaded={true}
              userId={userId || undefined}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
