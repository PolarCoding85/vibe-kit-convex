// app/(admin)/admin/settings/team/page.tsx

import { auth, currentUser } from '@clerk/nextjs/server'
import { clerkClient } from '@clerk/nextjs/server'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Import layout components
import { AdminPageHeader } from '@/components/layout/admin/admin-page-header'

// Import team-specific components
import { TeamMembersTab } from '@/components/pages/admin/settings/team/team-members-tab'
import { TeamInvitationsTab } from '@/components/pages/admin/settings/team/team-invitations-tab'
import { TeamLoadingSkeleton } from '@/components/pages/admin/settings/team/team-loading-skeleton'

// Define serializable types for passing to client components
type SerializedOrganization = {
  id: string
  name: string
  slug: string
  imageUrl?: string
  createdAt: number
}

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

type SerializedInvitation = {
  id: string
  emailAddress: string
  role: string
  createdAt: number
  status: string | undefined
}

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

    // Serialize the organization data for client components
    const serializedOrg: SerializedOrganization = {
      id: organization.id,
      name: organization.name,
      slug: organization.slug || '',
      imageUrl: organization.imageUrl || undefined,
      createdAt: organization.createdAt
    }

    // Serialize the member data for client components
    const serializedMembers: SerializedMember[] = memberships.data.map(member => ({
      id: member.id,
      role: member.role,
      status: 'active', // Default to active since Clerk doesn't expose this directly
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
      publicUserData: member.publicUserData ? {
        userId: member.publicUserData.userId,
        firstName: member.publicUserData.firstName || undefined,
        lastName: member.publicUserData.lastName || undefined,
        imageUrl: member.publicUserData.imageUrl || undefined,
        identifier: member.publicUserData.identifier
      } : undefined
    }))

    // Serialize the invitation data for client components
    const serializedInvitations: SerializedInvitation[] = invitations.data.map(invitation => ({
      id: invitation.id,
      emailAddress: invitation.emailAddress,
      role: invitation.role,
      createdAt: invitation.createdAt,
      status: invitation.status || 'pending' // Use 'pending' as default if status is undefined
    }))

    return {
      organization: serializedOrg,
      members: serializedMembers,
      invitations: serializedInvitations
    }
  } catch (error) {
    console.error('Error fetching organization data:', error)
    return { organization: null, members: [], invitations: [] }
  }
}

export default async function TeamSettingsPage() {
  const { organization, members, invitations } = await getData()

  if (!organization) {
    return <TeamLoadingSkeleton />
  }

  return (
    <div className='container p-8'>
      <div className='mx-auto max-w-4xl'>
        <AdminPageHeader 
          title='Team Settings' 
          description='Manage your team members and invitations.'
        />
        
        <Tabs defaultValue='members' className='w-full'>
          <TabsList className='mb-6'>
            <TabsTrigger value='members'>
              Members ({members.length})
            </TabsTrigger>
            <TabsTrigger value='invitations'>
              Invitations ({invitations.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value='members' className='space-y-6'>
            <TeamMembersTab members={members} />
          </TabsContent>

          <TabsContent value='invitations' className='space-y-6'>
            <TeamInvitationsTab invitations={invitations} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
