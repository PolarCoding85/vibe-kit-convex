'use server'

import { clerkClient } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

// Server action to update a user's role in an organization
export async function updateOrganizationMembershipRole(
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  try {
    const organizationId = formData.get('organizationId') as string
    const userId = formData.get('userId') as string
    const role = formData.get('role') as string

    if (!organizationId || !userId || !role) {
      return {
        success: false,
        message: 'Missing required fields'
      }
    }

    // Initialize the clerk client
    const clerk = await clerkClient()
    
    // Update the organization membership
    await clerk.organizations.updateOrganizationMembership({
      organizationId,
      userId,
      role
    })

    // Revalidate the profile page to reflect the changes
    revalidatePath('/admin/settings/profile')

    return {
      success: true,
      message: 'Role updated successfully'
    }
  } catch (error) {
    console.error('Error updating organization membership:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred'
    }
  }
}

// Server action to remove a user from an organization
export async function deleteOrganizationMembership(
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  try {
    const organizationId = formData.get('organizationId') as string
    const userId = formData.get('userId') as string

    if (!organizationId || !userId) {
      return {
        success: false,
        message: 'Missing required fields'
      }
    }

    // Initialize the clerk client
    const clerk = await clerkClient()
    
    // Delete the organization membership
    await clerk.organizations.deleteOrganizationMembership({
      organizationId,
      userId
    })

    // Revalidate the profile page to reflect the changes
    revalidatePath('/admin/settings/profile')

    return {
      success: true,
      message: 'Member removed from organization successfully'
    }
  } catch (error) {
    console.error('Error removing member from organization:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred'
    }
  }
}
