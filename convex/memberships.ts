// convex/memberships.ts

import { v } from 'convex/values'
import { internalMutation } from './_generated/server'
import { authQuery } from './util/customFunctions'

/**
 * Get memberships for a specific organization
 */
export const byOrganization = authQuery({
  args: { organizationId: v.id('organizations') },
  handler: async (ctx, { organizationId }) => {
    return await ctx.db
      .query('organizationMemberships')
      .withIndex('byOrganization', q => q.eq('organizationId', organizationId))
      .collect()
  }
})

/**
 * Get memberships for the authenticated user
 */
export const forCurrentUser = authQuery({
  args: {},
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return []

    const user = await ctx.db
      .query('users')
      .withIndex('byExternalId', q => q.eq('externalId', identity.subject))
      .unique()

    if (!user) return []

    return await ctx.db
      .query('organizationMemberships')
      .withIndex('byUser', q => q.eq('userId', user._id))
      .collect()
  }
})

/**
 * Create or update a membership from Clerk data
 */
export const upsertFromClerk = internalMutation({
  args: {
    data: v.any(),
    eventType: v.optional(v.string())
  },
  handler: async (ctx, { data, eventType }) => {
    // First, find the user
    let user = await ctx.db
      .query('users')
      .withIndex('byExternalId', q =>
        q.eq('externalId', data.public_user_data.user_id)
      )
      .unique()

    // If user doesn't exist but we have public_user_data, create a placeholder user
    if (!user && data.public_user_data) {
      const clerkUserId = data.public_user_data.user_id
      const publicUserData = data.public_user_data
      
      // Extract name from public_user_data
      const firstName = publicUserData.first_name || ''
      const lastName = publicUserData.last_name || ''
      const name = `${firstName} ${lastName}`.trim() || 'Unknown User'
      const email = publicUserData.email_address || undefined

      // Create a placeholder user with minimal available info
      console.log(`Creating placeholder user for Clerk user ${clerkUserId}`)
      const userId = await ctx.db.insert('users', {
        externalId: clerkUserId,
        name,
        email,
        createdAt: new Date().toISOString(),
        publicMetadata: { isPlaceholder: true }
      })

      // Get the full user record
      user = await ctx.db.get(userId)
    }
    
    // If we still don't have a user, we can't proceed
    if (!user) {
      console.warn(
        `Cannot create membership: User ${data.public_user_data?.user_id} not found and couldn't create placeholder`
      )
      return
    }

    // Then, find the organization
    let organization = await ctx.db
      .query('organizations')
      .withIndex('byExternalId', q => q.eq('externalId', data.organization.id))
      .unique()

    // If organization doesn't exist, create a placeholder organization
    if (!organization && data.organization) {
      const clerkOrgId = data.organization.id
      const orgData = data.organization
      
      // Extract basic info from the organization data
      const name = orgData.name || 'Placeholder Organization'
      const slug = orgData.slug || name.toLowerCase().replace(/[^a-z0-9]/g, '-')
      
      // Create a placeholder organization with minimal available info
      console.log(`Creating placeholder organization for Clerk org ${clerkOrgId}`)
      const orgId = await ctx.db.insert('organizations', {
        externalId: clerkOrgId,
        name,
        slug,
        createdAt: new Date().toISOString(),
        publicMetadata: { isPlaceholder: true }
      })
      
      // Get the full organization record
      organization = await ctx.db.get(orgId)
      // This should never happen, but to satisfy TypeScript
      if (!organization) {
        throw new Error(`Failed to create placeholder organization for ${clerkOrgId}`)
      }
    }
    
    // If we still don't have an organization, we can't proceed
    if (!organization) {
      console.warn(
        `Cannot create membership: Organization ${data.organization?.id} not found and couldn't create placeholder`
      )
      return
    }

    // Generate a unique external ID for the membership
    // This allows us to find memberships by their Clerk ID later
    const externalId =
      data.id || `${data.organization.id}:${data.public_user_data.user_id}`

    // Create enhanced membership data object
    const membershipData = {
      // Required fields
      userId: user._id,
      organizationId: organization._id,
      role: data.role,

      // External ID for looking up this membership
      externalId,

      // Timestamps
      createdAt: data.created_at
        ? new Date(data.created_at).toISOString()
        : undefined,
      updatedAt: data.updated_at
        ? new Date(data.updated_at).toISOString()
        : undefined,

      // Additional data
      publicUserData: data.public_user_data || undefined,

      // Metadata (if available)
      publicMetadata:
        data.public_metadata && Object.keys(data.public_metadata).length > 0
          ? data.public_metadata
          : undefined,
      privateMetadata:
        data.private_metadata && Object.keys(data.private_metadata).length > 0
          ? data.private_metadata
          : undefined
    }

    // Ensure required fields are always included
    const requiredFields = {
      userId: membershipData.userId,
      organizationId: membershipData.organizationId,
      role: membershipData.role
    }

    // Filter out undefined values for optional fields
    const optionalFields = Object.fromEntries(
      Object.entries(membershipData).filter(
        ([key, v]) =>
          v !== undefined && !['userId', 'organizationId', 'role'].includes(key)
      )
    )

    // Combine required and optional fields
    const finalData = { ...requiredFields, ...optionalFields }

    // Try to find an existing membership by its externalId first
    let existingMembership = await ctx.db
      .query('organizationMemberships')
      .withIndex('byExternalId', q => q.eq('externalId', externalId))
      .unique()

    if (!existingMembership) {
      // If not found by externalId, try to find by user and organization
      existingMembership = await ctx.db
        .query('organizationMemberships')
        .withIndex('byUserAndOrganization', q =>
          q.eq('userId', user._id).eq('organizationId', organization._id)
        )
        .unique()
    }

    if (existingMembership) {
      // Update existing membership
      return await ctx.db.patch(existingMembership._id, finalData)
    } else {
      // Create new membership
      return await ctx.db.insert('organizationMemberships', finalData)
    }
  }
})

/**
 * Delete a membership from Clerk data
 *
 * Format for Clerk membership IDs could be either:
 * 1. Direct membership ID (e.g., "orgmem_123456")
 * 2. Composite ID format: "org_[org_id]:user_[user_id]"
 */
export const deleteFromClerk = internalMutation({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    // First check if we can find the membership directly by its externalId
    const directMembership = await ctx.db
      .query('organizationMemberships')
      .withIndex('byExternalId', q => q.eq('externalId', id))
      .unique()

    if (directMembership) {
      // Found directly by externalId - delete it
      await ctx.db.delete(directMembership._id)
      return { success: true }
    }

    // If not found directly, try parsing the ID to find by organization and user
    try {
      // Split on colon for composite IDs
      const parts = id.split(':')
      if (parts.length !== 2) {
        throw new Error(`Membership not found and ID format invalid: ${id}`)
      }

      // Extract Clerk organization ID and user ID
      const orgPart = parts[0] // org_[org_id]
      const userPart = parts[1] // user_[user_id]

      const clerkOrgId = orgPart.startsWith('org_') ? orgPart : null
      const clerkUserId = userPart.startsWith('user_') ? userPart : null

      if (!clerkOrgId || !clerkUserId) {
        throw new Error(
          `Could not extract organization or user IDs from: ${id}`
        )
      }

      // Find the organization and user by their Clerk IDs
      const organization = await ctx.db
        .query('organizations')
        .withIndex('byExternalId', q => q.eq('externalId', clerkOrgId))
        .unique()

      const user = await ctx.db
        .query('users')
        .withIndex('byExternalId', q => q.eq('externalId', clerkUserId))
        .unique()

      if (!organization || !user) {
        console.warn(
          `Cannot delete membership: Organization or user not found for ${id}`
        )
        return { success: false, reason: 'org_or_user_not_found' }
      }

      // Find and delete the membership
      const membership = await ctx.db
        .query('organizationMemberships')
        .withIndex('byUserAndOrganization', q =>
          q.eq('userId', user._id).eq('organizationId', organization._id)
        )
        .unique()

      if (membership) {
        await ctx.db.delete(membership._id)
        return { success: true }
      } else {
        console.warn(
          `Membership between ${clerkUserId} and ${clerkOrgId} not found`
        )
        return { success: false, reason: 'membership_not_found' }
      }
    } catch (error: any) {
      console.error(`Error processing membership deletion: ${error}`)
      return {
        success: false,
        reason: 'processing_error',
        error: String(error)
      }
    }
  }
})

/**
 * Admin function to add a user to an organization with a specific role
 */
export const addMember = internalMutation({
  args: {
    userId: v.id('users'),
    organizationId: v.id('organizations'),
    role: v.string()
  },
  handler: async (ctx, { userId, organizationId, role }) => {
    // Check if membership already exists
    const existing = await ctx.db
      .query('organizationMemberships')
      .withIndex('byUserAndOrganization', q =>
        q.eq('userId', userId).eq('organizationId', organizationId)
      )
      .unique()

    if (existing) {
      // Update role if membership exists
      return await ctx.db.patch(existing._id, { role })
    } else {
      // Create new membership
      return await ctx.db.insert('organizationMemberships', {
        userId,
        organizationId,
        role
      })
    }
  }
})

/**
 * Admin function to remove a user from an organization
 */
export const removeMember = internalMutation({
  args: {
    userId: v.id('users'),
    organizationId: v.id('organizations')
  },
  handler: async (ctx, { userId, organizationId }) => {
    const membership = await ctx.db
      .query('organizationMemberships')
      .withIndex('byUserAndOrganization', q =>
        q.eq('userId', userId).eq('organizationId', organizationId)
      )
      .unique()

    if (membership) {
      await ctx.db.delete(membership._id)
      return { success: true }
    } else {
      return { success: false, reason: 'membership_not_found' }
    }
  }
})
