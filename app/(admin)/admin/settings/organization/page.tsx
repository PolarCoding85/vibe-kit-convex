// app/(admin)/admin/settings/organization/page.tsx

import { auth, currentUser } from '@clerk/nextjs/server'
import { clerkClient } from '@clerk/nextjs/server'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { OrganizationDetailsTab } from '@/components/pages/admin/settings/organization/organization-details-tab'
import { OrganizationMembersTab } from '@/components/pages/admin/settings/organization/organization-members-tab'
import { OrganizationInvitationsTab } from '@/components/pages/admin/settings/organization/organization-invitations-tab'
import { OrganizationLoadingSkeleton } from '@/components/pages/admin/settings/organization/organization-loading-skeleton'

// Fetch organization data server-side
async function getData() {
  const [{ userId, orgId }, user] = await Promise.all([
    auth(),
    currentUser()
  ])

  if (!userId || !orgId || !user) {
    return { organization: null, members: [], invitations: [] }
  }

  // Initialize the clerk client
  const clerk = await clerkClient()

  try {
    // Get the current organization
    const organization = await clerk.organizations.getOrganization({
      organizationId: orgId
    })

    // Get organization members
    const memberships = await clerk.organizations.getOrganizationMembershipList({
      organizationId: orgId
    })

    // Get organization invitations
    const invitations = await clerk.organizations.getOrganizationInvitationList({
      organizationId: orgId
    })

    return {
      organization,
      members: memberships.data,
      invitations: invitations.data
    }
  } catch (error) {
    console.error('Error fetching organization data:', error)
    return { organization: null, members: [], invitations: [] }
  }
}

export default async function OrganizationPage() {
  const { organization, members, invitations } = await getData()

  if (!organization) {
    return <OrganizationLoadingSkeleton />
  }

  return (
    <div className='container p-8'>
      <div className='mx-auto max-w-4xl'>
        <div className='mb-6 flex items-center space-x-4'>
          <Avatar className='h-20 w-20'>
            <AvatarImage src={organization.imageUrl} alt={organization.name} />
            <AvatarFallback className='text-lg'>
              {organization.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className='text-2xl font-bold'>{organization.name}</h1>
            <p className='text-muted-foreground'>{organization.slug}</p>
          </div>
        </div>

        <Tabs defaultValue='organization' className='w-full'>
          <TabsList className='mb-6'>
            <TabsTrigger value='organization'>Organization</TabsTrigger>
            <TabsTrigger value='members'>
              Members ({members.length})
            </TabsTrigger>
            <TabsTrigger value='invitations'>
              Invitations ({invitations.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value='organization' className='space-y-6'>
            <OrganizationDetailsTab organization={organization} />
          </TabsContent>

          <TabsContent value='members' className='space-y-6'>
            <OrganizationMembersTab members={members} />
          </TabsContent>

          <TabsContent value='invitations' className='space-y-6'>
            <OrganizationInvitationsTab invitations={invitations} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
