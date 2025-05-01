// convex/invitations.ts

import { v } from 'convex/values'
import { internalMutation, MutationCtx } from './_generated/server'
import { Id } from './_generated/dataModel'
import { authQuery } from './util/customFunctions'

/**
 * Helper function to extract the user who created an invitation from webhook event attributes
 */
async function getCreatorFromEventAttributes(
  ctx: MutationCtx,
  eventAttributes: any,
  organizationId: Id<'organizations'>
): Promise<Id<'users'> | undefined> {
  try {
    // Try to find the organization
    const organization = await ctx.db.get(organizationId)
    if (!organization) return undefined;
    
    // Check if organization has createdBy field and it's a string
    const createdBy = organization.createdBy;
    if (typeof createdBy === 'string') {
      // Look up the user by their external ID
      const creator = await ctx.db
        .query('users')
        .withIndex('byExternalId', q => q.eq('externalId', createdBy))
        .unique()
      
      if (creator) {
        return creator._id
      }
    }
    
    // If we have HTTP request data, try to match an active session by IP
    if (eventAttributes && typeof eventAttributes === 'object') {
      const httpRequest = eventAttributes.http_request;
      
      if (httpRequest && typeof httpRequest === 'object') {
        const clientIp = httpRequest.client_ip;
        
        if (typeof clientIp === 'string') {
          // Find sessions with the same IP address
          const recentSessions = await ctx.db
            .query('sessions')
            .filter(q => q.eq(q.field('ipAddress'), clientIp))
            .order('desc')
            .take(5);
          
          // Look for active sessions
          for (const session of recentSessions) {
            if (session.status === 'active') {
              return session.userId;
            }
          }
        }
      }
    }
    
    // We couldn't find the creator
    return undefined;
  } catch (error) {
    console.error('Error identifying invitation creator:', error);
    return undefined;
  }
}

/**
 * Create or update an organization invitation from Clerk webhook data
 */
export const upsertFromClerk = internalMutation({
  args: {
    data: v.any(), // Invitation data from Clerk
    eventType: v.string(), // Event type like 'organizationInvitation.created', etc.
    eventAttributes: v.optional(v.any()) // Extra information from the webhook event
  },
  handler: async (ctx, { data, eventType, eventAttributes }) => {
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

    // Determine the user who created this invitation
    let createdByUserId: Id<'users'> | undefined = undefined
    
    // Method 1: Check if creator user exists in the webhook payload
    const userId = data.public_user_data?.user_id;
    if (userId && typeof userId === 'string') {
      const creatorUser = await ctx.db
        .query('users')
        .withIndex('byExternalId', q =>
          q.eq('externalId', userId)
        )
        .unique()

      if (creatorUser) {
        createdByUserId = creatorUser._id
      }
    }
    
    // Method 2: For organization.created events, get the user from org.created_by
    if (!createdByUserId && organization.createdBy && typeof organization.createdBy === 'string') {
      // Store in local variable to help TypeScript with type narrowing
      const creatingUserId: string = organization.createdBy;
      
      const orgCreator = await ctx.db
        .query('users')
        .withIndex('byExternalId', q => q.eq('externalId', creatingUserId))
        .unique()
        
      if (orgCreator) {
        createdByUserId = orgCreator._id
      }
    }
    
    // Method 3: Look for creator info in the webhook event attributes
    if (!createdByUserId && eventAttributes && eventType === 'organizationInvitation.created') {
      // Try to extract the active session/user from HTTP request info
      const creatingUserId = await getCreatorFromEventAttributes(ctx, eventAttributes, organization._id)
      if (creatingUserId) {
        createdByUserId = creatingUserId
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
