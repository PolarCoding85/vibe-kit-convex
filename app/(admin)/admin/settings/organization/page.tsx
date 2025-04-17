// app/(admin)/admin/settings/organization/page.tsx

import { auth, currentUser } from '@clerk/nextjs/server'
import { clerkClient } from '@clerk/nextjs/server'

import { AdminPageHeader } from '@/components/layout/admin/admin-page-header'
import { OrganizationDetailsForm } from '@/components/pages/admin/settings/organization/organization-details-form'
import { OrganizationLoadingSkeleton } from '@/components/pages/admin/settings/organization/organization-loading-skeleton'

// Fetch organization data server-side
async function getData() {
  const [{ userId, orgId }, user] = await Promise.all([auth(), currentUser()])

  if (!userId || !orgId || !user) {
    return { organization: null }
  }

  // Initialize the clerk client
  const clerk = await clerkClient()

  try {
    // Get the current organization
    const organization = await clerk.organizations.getOrganization({
      organizationId: orgId
    })
    
    // Get creator email if available
    let creatorEmail = 'Unknown';
    if (organization.createdBy) {
      try {
        const creator = await clerk.users.getUser(organization.createdBy);
        creatorEmail = creator.emailAddresses[0]?.emailAddress || 'No email provided';
      } catch (error) {
        console.error('Error fetching creator details:', error);
      }
    }

    return {
      organization,
      creatorEmail
    }
  } catch (error) {
    console.error('Error fetching organization data:', error)
    return { organization: null, creatorEmail: null }
  }
}

export default async function OrganizationPage() {
  const { organization, creatorEmail } = await getData()

  if (!organization) {
    return <OrganizationLoadingSkeleton />
  }

  return (
    <div className='container px-4 py-6 md:px-6 md:py-8'>
      <div className='mx-auto max-w-6xl'>
        <AdminPageHeader
          title='Organization Settings'
          description="Manage your organization's profile, members, and invitations."
        />

        <div className='mt-6 space-y-6'>
          <OrganizationDetailsForm
            organizationName={organization.name}
            organizationSlug={organization.slug || ''}
            organizationImageUrl={organization.imageUrl}
            organizationId={organization.id}
            createdAt={organization.createdAt}
            updatedAt={organization.updatedAt}
            creatorEmail={creatorEmail}
          />
        </div>
      </div>
    </div>
  )
}
