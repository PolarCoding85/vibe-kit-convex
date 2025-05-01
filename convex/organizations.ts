// convex/organizations.ts
import { internalMutation, QueryCtx, MutationCtx } from './_generated/server'
import { v, ConvexError } from 'convex/values'
import { authQuery, authMutation } from './util/customFunctions'

// Get current user's organizations
export const listForUser = authQuery({
  args: {},
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return []

    const user = await ctx.db
      .query('users')
      .withIndex('byExternalId', q => q.eq('externalId', identity.subject))
      .unique()

    if (!user) return []

    const memberships = await ctx.db
      .query('organizationMemberships')
      .withIndex('byUser', q => q.eq('userId', user._id))
      .collect()

    const organizationIds = memberships.map(m => m.organizationId)

    if (organizationIds.length === 0) return []

    return await Promise.all(organizationIds.map(id => ctx.db.get(id)))
  }
})

/**
 * Get a user's role in an organization
 */
export const getUserRole = authQuery({
  args: { organizationId: v.id('organizations') },
  handler: async (ctx, { organizationId }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new ConvexError('Not authenticated')
    }

    const user = await ctx.db
      .query('users')
      .withIndex('byExternalId', q => q.eq('externalId', identity.subject))
      .unique()

    if (!user) {
      throw new ConvexError('User not found')
    }

    // Check membership
    const membership = await ctx.db
      .query('organizationMemberships')
      .withIndex('byUserAndOrganization', q =>
        q.eq('userId', user._id).eq('organizationId', organizationId)
      )
      .unique()

    if (!membership) {
      return { isMember: false, role: null }
    }

    return { isMember: true, role: membership.role }
  }
})

/**
 * Get an organization by its ID, checks if the user is a member
 */
export const getById = authQuery({
  args: { organizationId: v.id('organizations') },
  handler: async (ctx, { organizationId }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new ConvexError('Not authenticated')

    const user = await ctx.db
      .query('users')
      .withIndex('byExternalId', q => q.eq('externalId', identity.subject))
      .unique()

    if (!user) throw new ConvexError('User not found')

    // Check if the user is a member of this organization
    const membership = await ctx.db
      .query('organizationMemberships')
      .withIndex('byUserAndOrganization', q =>
        q.eq('userId', user._id).eq('organizationId', organizationId)
      )
      .unique()

    if (!membership) throw new ConvexError('Not a member of this organization')

    return await ctx.db.get(organizationId)
  }
})

// Create or update organization from Clerk
export const upsertFromClerk = internalMutation({
  args: {
    data: v.any(), // Organization data from Clerk
    eventType: v.string() // Event type (organization.created, organization.updated, etc.)
  },
  async handler(ctx, { data, eventType }) {
    // If this is a delete event, we shouldn't try to extract organization details
    if (eventType === 'organization.deleted') {
      console.warn(
        'Received delete event in upsertFromClerk - this should be handled by deleteFromClerk'
      )
      return null
    }

    // Create enhanced organization attributes object
    const orgAttributes = {
      // Basic information
      name: data.name,
      externalId: data.id,

      // URLs
      imageUrl: data.image_url || undefined,
      logoUrl: data.logo_url || undefined,

      // Additional info
      slug: data.slug || undefined,
      createdBy: data.created_by || undefined,

      // Timestamps
      createdAt: data.created_at
        ? new Date(data.created_at).toISOString()
        : undefined,
      updatedAt: data.updated_at
        ? new Date(data.updated_at).toISOString()
        : undefined,

      // Metadata
      publicMetadata:
        data.public_metadata && Object.keys(data.public_metadata).length > 0
          ? data.public_metadata
          : undefined,
      privateMetadata:
        data.private_metadata && Object.keys(data.private_metadata).length > 0
          ? data.private_metadata
          : undefined
    }

    // Filter out undefined values for cleaner database entries
    const requiredFields = {
      name: orgAttributes.name,
      externalId: orgAttributes.externalId
    }

    // Get optional fields that aren't undefined
    const optionalFields = Object.fromEntries(
      Object.entries(orgAttributes).filter(
        ([key, v]) => v !== undefined && key !== 'name' && key !== 'externalId'
      )
    )

    // Combine required and optional fields
    const finalAttributes = { ...requiredFields, ...optionalFields }

    // Update or create organization
    const org = await organizationByExternalId(ctx, data.id)
    if (org === null) {
      return await ctx.db.insert('organizations', finalAttributes)
    } else {
      await ctx.db.patch(org._id, finalAttributes)
      return org._id
    }
  }
})

/**
 * Delete an organization based on Clerk data
 */
export const deleteFromClerk = internalMutation({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    const organization = await organizationByExternalId(ctx, id)

    if (!organization) {
      console.warn(
        `Cannot delete organization: Organization with external ID ${id} not found`
      )
      return
    }

    // Find all memberships related to this organization and delete them
    const memberships = await ctx.db
      .query('organizationMemberships')
      .withIndex('byOrganization', q =>
        q.eq('organizationId', organization._id)
      )
      .collect()

    // Delete all memberships first
    for (const membership of memberships) {
      await ctx.db.delete(membership._id)
    }

    // Finally delete the organization itself
    await ctx.db.delete(organization._id)

    console.log(
      `Successfully deleted organization ${id} and ${memberships.length} memberships`
    )
    return { success: true }
  }
})

// Add user to organization
export const addMember = internalMutation({
  args: {
    userId: v.id('users'),
    organizationId: v.id('organizations'),
    role: v.string()
  },
  async handler(ctx, { userId, organizationId, role }) {
    const existing = await ctx.db
      .query('organizationMemberships')
      .withIndex('byUserAndOrganization', q =>
        q.eq('userId', userId).eq('organizationId', organizationId)
      )
      .unique()

    if (existing) {
      await ctx.db.patch(existing._id, { role })
      return existing._id
    } else {
      return await ctx.db.insert('organizationMemberships', {
        userId,
        organizationId,
        role
      })
    }
  }
})

/**
 * Update organization details - requires admin permissions
 */
export const updateOrganization = authMutation({
  args: {
    organizationId: v.id('organizations'),
    name: v.optional(v.string())
  },
  handler: async (ctx, { organizationId, name }) => {
    // Import the requireOrgAdmin function from our util/orgAuth.ts
    const { requireOrgAdmin } = await import('./util/orgAuth')

    // This will throw an error if the user is not an admin
    await requireOrgAdmin(ctx, organizationId)

    // If we get here, the user is an admin of the organization
    const updates: Record<string, any> = {}

    if (name !== undefined) {
      updates.name = name
    }

    // Only update if there are changes
    if (Object.keys(updates).length > 0) {
      await ctx.db.patch(organizationId, updates)
    }

    return { success: true }
  }
})

/**
 * Update a member's role in an organization - requires admin permissions
 */
export const updateMemberRole = authMutation({
  args: {
    organizationId: v.id('organizations'),
    memberId: v.id('organizationMemberships'),
    newRole: v.string()
  },
  handler: async (ctx, { organizationId, memberId, newRole }) => {
    // Import the requireOrgAdmin function from our util/orgAuth.ts
    const { requireOrgAdmin } = await import('./util/orgAuth')

    // Verify the current user is an admin of this organization
    await requireOrgAdmin(ctx, organizationId)

    // Verify the membership exists and belongs to this organization
    const membership = await ctx.db.get(memberId)
    if (!membership) {
      throw new ConvexError('Membership not found')
    }

    if (membership.organizationId !== organizationId) {
      throw new ConvexError('Membership does not belong to this organization')
    }

    // Update the role
    await ctx.db.patch(memberId, { role: newRole })

    return { success: true }
  }
})

async function organizationByExternalId(
  ctx: QueryCtx | MutationCtx,
  externalId: string
) {
  return await ctx.db
    .query('organizations')
    .withIndex('byExternalId', (q: any) => q.eq('externalId', externalId))
    .unique()
}
