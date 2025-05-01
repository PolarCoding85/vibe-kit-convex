// convex/invitations.ts

import { v } from 'convex/values'
import { internalMutation } from './_generated/server'
import { Id } from './_generated/dataModel'
import { authQuery } from './util/customFunctions'

/**
 * Create or update an organization invitation from Clerk webhook data
 */
export const upsertFromClerk = internalMutation({
  args: {
    data: v.any(), // Invitation data from Clerk
    eventType: v.string() // Event type like 'organizationInvitation.created', etc.
  },
  handler: async (ctx, { data, eventType }) => {
    // First, find the organization this invitation belongs to
    const organization = await ctx.db
      .query('organizations')
      .withIndex('byExternalId', q =>
        q.eq('externalId', data.organization?.id || data.organization_id)
      )
      .unique()

    if (!organization) {
      console.warn(
        `Cannot handle invitation: Organization ${data.organization?.id || data.organization_id} not found`
      )
      return { success: false, reason: 'organization_not_found' }
    }

    // Check if creator user exists (if available in the payload)
    let createdByUserId: Id<'users'> | undefined = undefined
    if (data.public_user_data?.user_id) {
      const creatorUser = await ctx.db
        .query('users')
        .withIndex('byExternalId', q =>
          q.eq('externalId', data.public_user_data.user_id)
        )
        .unique()

      if (creatorUser) {
        createdByUserId = creatorUser._id
      }
    }

    // Check for existing invitation
    const existingInvitation = await ctx.db
      .query('organizationInvitations')
      .withIndex('byExternalId', q => q.eq('externalId', data.id))
      .unique()

    // Determine invitation status based on event type
    let invitationStatus = 'pending'
    if (eventType === 'organizationInvitation.accepted') {
      invitationStatus = 'accepted'
    } else if (eventType === 'organizationInvitation.revoked') {
      invitationStatus = 'revoked'
    } else if (data.status) {
      // Use status from data if available
      invitationStatus = data.status
    }

    const now = new Date().toISOString()

    // Create enhanced invitation data object with all available fields
    const invitationData = {
      // Basic identification
      externalId: data.id,
      organizationId: organization._id,

      // Recipient information
      email: data.email_address,

      // Status and role
      status: invitationStatus,
      role: data.role,

      // Timestamps
      createdAt: data.created_at
        ? new Date(data.created_at).toISOString()
        : now,
      updatedAt: data.updated_at
        ? new Date(data.updated_at).toISOString()
        : now,

      // Related entities
      createdByUserId,
      orgExternalId: data.organization?.id || data.organization_id,

      // Additional data
      publicMetadata:
        data.public_metadata && Object.keys(data.public_metadata).length > 0
          ? data.public_metadata
          : undefined,
      privateMetadata:
        data.private_metadata && Object.keys(data.private_metadata).length > 0
          ? data.private_metadata
          : undefined,
      publicUserData: data.public_user_data || undefined
    }

    // Ensure required fields are always included
    const requiredFields = {
      externalId: invitationData.externalId,
      organizationId: invitationData.organizationId,
      email: invitationData.email,
      status: invitationData.status,
      role: invitationData.role,
      createdAt: invitationData.createdAt
    }

    // Filter out undefined values for optional fields
    const optionalFields = Object.fromEntries(
      Object.entries(invitationData).filter(
        ([key, v]) =>
          v !== undefined &&
          ![
            'externalId',
            'organizationId',
            'email',
            'status',
            'role',
            'createdAt'
          ].includes(key)
      )
    )

    // Combine required and optional fields
    const finalData = { ...requiredFields, ...optionalFields }

    if (existingInvitation) {
      // Update existing invitation
      await ctx.db.patch(existingInvitation._id, finalData)
      return { success: true, invitationId: existingInvitation._id }
    } else {
      // Create new invitation
      const newInvitationId = await ctx.db.insert(
        'organizationInvitations',
        finalData
      )
      return { success: true, invitationId: newInvitationId }
    }
  }
})

/**
 * Delete an invitation based on Clerk data
 */
export const deleteFromClerk = internalMutation({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    const invitation = await ctx.db
      .query('organizationInvitations')
      .withIndex('byExternalId', q => q.eq('externalId', id))
      .unique()

    if (!invitation) {
      console.warn(
        `Cannot delete invitation: Invitation with ID ${id} not found`
      )
      return { success: false, reason: 'invitation_not_found' }
    }

    await ctx.db.delete(invitation._id)
    return { success: true }
  }
})

/**
 * Get pending invitations for an organization
 */
export const getPendingByOrganization = authQuery({
  args: { organizationId: v.id('organizations') },
  handler: async (ctx, { organizationId }) => {
    // Check if user is a member of this organization
    const { checkOrganizationMembership } = await import('./util/orgAuth')
    await checkOrganizationMembership(ctx, organizationId)

    return await ctx.db
      .query('organizationInvitations')
      .withIndex('byOrganizationAndStatus', q =>
        q.eq('organizationId', organizationId).eq('status', 'pending')
      )
      .collect()
  }
})

/**
 * Get all invitations for an organization
 */
export const getAllByOrganization = authQuery({
  args: {
    organizationId: v.id('organizations'),
    status: v.optional(v.string())
  },
  handler: async (ctx, { organizationId, status }) => {
    // Check if user is a member and has admin permissions
    const { requireOrgAdmin } = await import('./util/orgAuth')
    await requireOrgAdmin(ctx, organizationId)

    if (status) {
      return await ctx.db
        .query('organizationInvitations')
        .withIndex('byOrganizationAndStatus', q =>
          q.eq('organizationId', organizationId).eq('status', status)
        )
        .collect()
    } else {
      return await ctx.db
        .query('organizationInvitations')
        .withIndex('byOrganization', q =>
          q.eq('organizationId', organizationId)
        )
        .collect()
    }
  }
})

/**
 * Get invitations by email address
 */
export const getByEmail = authQuery({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    return await ctx.db
      .query('organizationInvitations')
      .withIndex('byEmail', q => q.eq('email', email))
      .collect()
  }
})
