// convex/users.ts

import { internalMutation, MutationCtx, QueryCtx } from './_generated/server'
import { UserJSON } from '@clerk/backend'
import { v, Validator, ConvexError } from 'convex/values'
import { authQuery } from './util/customFunctions'

/**
 * Get the currently authenticated user
 */
export const current = authQuery({
  args: {},
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity()
    // Even though authQuery has already verified identity, TypeScript needs reassurance
    if (!identity) {
      throw new ConvexError('Not authenticated')
    }
    return await userByExternalId(ctx, identity.subject)
  }
})

/**
 * Get a user by ID (requires authentication)
 */
export const getById = authQuery({
  args: { id: v.id('users') },
  handler: async (ctx, { id }) => {
    const user = await ctx.db.get(id)
    if (!user) {
      throw new ConvexError('User not found')
    }
    return user
  }
})

/**
 * Create or update a user from Clerk webhook data
 */
export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<UserJSON> }, // no runtime validation, trust Clerk
  async handler(ctx, { data }) {
    // Find primary email address if available
    let primaryEmail: string | undefined = undefined
    let emailVerified: boolean | undefined = undefined

    if (data.email_addresses && data.email_addresses.length > 0) {
      const primaryEmailObj = data.email_addresses.find(
        (email: any) => email.id === data.primary_email_address_id
      )

      if (primaryEmailObj) {
        primaryEmail = primaryEmailObj.email_address
        emailVerified = primaryEmailObj.verification?.status === 'verified'
      } else {
        // If no primary email found but emails exist, use the first one
        primaryEmail = data.email_addresses[0].email_address
        emailVerified =
          data.email_addresses[0].verification?.status === 'verified'
      }
    }

    // Extract system role flags from Clerk's private metadata (if present)
    const privateMetadata = data.private_metadata || {}
    const isSuperAdmin = privateMetadata.isSuperAdmin === true
    const isSuperUser = privateMetadata.isSuperUser === true
    
    // Create enhanced user attributes object
    const userAttributes = {
      // Basic information
      name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
      externalId: data.id,
      firstName: data.first_name || undefined,
      lastName: data.last_name || undefined,
      email: primaryEmail,
      username: data.username || undefined,

      // Image URLs
      imageUrl: data.image_url || undefined,
      // Use type assertion since profile_image_url isn't in the TypeScript definition
      profileImageUrl: (data as any).profile_image_url || undefined,

      // Timestamps
      createdAt: data.created_at
        ? new Date(data.created_at).toISOString()
        : undefined,
      updatedAt: data.updated_at
        ? new Date(data.updated_at).toISOString()
        : undefined,
      lastSignInAt: data.last_sign_in_at
        ? new Date(data.last_sign_in_at).toISOString()
        : undefined,

      // Account status
      emailVerified,
      hasPassword: data.password_enabled === true ? true : undefined,
      twoFactorEnabled: data.two_factor_enabled === true ? true : undefined,
      
      // System role flags
      isSuperAdmin: isSuperAdmin || undefined,
      isSuperUser: isSuperUser || undefined,

      // Metadata
      publicMetadata:
        data.public_metadata && Object.keys(data.public_metadata).length > 0
          ? data.public_metadata
          : undefined,
      privateMetadata:
        data.private_metadata && Object.keys(data.private_metadata).length > 0
          ? data.private_metadata
          : undefined,
      externalSystemId: data.external_id || undefined
    }

    // Ensure required fields are always included
    const requiredFields = {
      name: userAttributes.name,
      externalId: userAttributes.externalId
    }

    // Filter out undefined values for cleaner database entries but keep required fields
    const optionalFields = Object.fromEntries(
      Object.entries(userAttributes).filter(
        ([key, v]) => v !== undefined && key !== 'name' && key !== 'externalId'
      )
    )

    // Combine required and optional fields
    const finalAttributes = { ...requiredFields, ...optionalFields }

    // Update or create user
    const user = await userByExternalId(ctx, data.id)
    if (user === null) {
      return await ctx.db.insert('users', finalAttributes)
    } else {
      await ctx.db.patch(user._id, finalAttributes)
      return user._id
    }
  }
})

/**
 * Delete a user based on Clerk webhook data
 */
export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await userByExternalId(ctx, clerkUserId)

    if (user !== null) {
      await ctx.db.delete(user._id)
      return { success: true }
    } else {
      console.warn(
        `Can't delete user, there is none for Clerk user ID: ${clerkUserId}`
      )
      return { success: false, reason: 'user_not_found' }
    }
  }
})

/**
 * Get the current user or throw an error if not found
 * @deprecated Use auth utilities from util/auth.ts instead
 */
export async function getCurrentUserOrThrow(ctx: QueryCtx) {
  const userRecord = await getCurrentUser(ctx)
  if (!userRecord) throw new ConvexError("Can't get current user")
  return userRecord
}

/**
 * Get the current user based on authentication information
 * @deprecated Use auth utilities from util/auth.ts instead
 */
export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity()
  if (identity === null) {
    return null
  }
  return await userByExternalId(ctx, identity.subject)
}

/**
 * Find a user by their external Clerk ID
 */
export async function userByExternalId(
  ctx: QueryCtx | MutationCtx,
  externalId: string
) {
  return await ctx.db
    .query('users')
    .withIndex('byExternalId', (q: any) => q.eq('externalId', externalId))
    .unique()
}
