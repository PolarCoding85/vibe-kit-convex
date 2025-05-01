// convex/admin/updateUserSystemRole.ts

import { internalMutation, mutation } from '../_generated/server'
import { v } from 'convex/values'
import { AuthenticationRequired } from '../util/auth'
import { isSuperAdmin } from '../../lib/constants/user-roles'
import { Id } from '../_generated/dataModel'

/**
 * Update a user's system role status (SuperAdmin or SuperUser)
 * This mutation is restricted to users who already have SuperAdmin status
 */
export const updateUserSystemRole = mutation({
  args: {
    userId: v.id('users'),
    isSuperAdmin: v.optional(v.boolean()),
    isSuperUser: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    // Get the authenticated user performing this action
    const identity = await AuthenticationRequired({ ctx })
    const executingUser = await ctx.db
      .query('users')
      .withIndex('byExternalId', q => q.eq('externalId', identity.subject))
      .unique()

    // Check if executing user has SuperAdmin privileges
    if (!executingUser || !isSuperAdmin(executingUser)) {
      throw new Error('Unauthorized: Only Super Admins can manage system roles')
    }

    // Get the target user
    const targetUser = await ctx.db.get(args.userId)
    if (!targetUser) {
      throw new Error('User not found')
    }

    // Prepare the update object
    const updates: Record<string, any> = {}
    
    // Only update fields that were provided
    if (args.isSuperAdmin !== undefined) {
      updates.isSuperAdmin = args.isSuperAdmin
    }
    
    if (args.isSuperUser !== undefined) {
      updates.isSuperUser = args.isSuperUser
    }

    // If no updates provided, return early
    if (Object.keys(updates).length === 0) {
      return { success: false, reason: 'no_updates_provided' }
    }

    // Update the user in our database
    await ctx.db.patch(args.userId, updates)

    // We'll return without syncing to Clerk for now
    // The actual sync can be implemented later with an action

    return { success: true }
  }
})

/**
 * Internal mutation to sync user system role status to Clerk's metadata
 * This should be called after updating the user in our database
 */
export const syncUserSystemRoleToClerk = internalMutation({
  args: {
    userId: v.id('users'),
    updates: v.object({
      isSuperAdmin: v.optional(v.boolean()),
      isSuperUser: v.optional(v.boolean())
    })
  },
  handler: async (ctx, { userId, updates }) => {
    // Get the user's externalId (Clerk ID)
    const user = await ctx.db.get(userId)
    if (!user || !user.externalId) {
      throw new Error('User not found or missing Clerk ID')
    }

    // In a real implementation, we would use Clerk's API to update user metadata
    // This would typically be done using an action with clerk-backend SDK
    
    // For demonstration, we'll just log what would happen
    console.log(`Would update Clerk user ${user.externalId} metadata:`, updates)
    
    // The below code would be used in an action with clerk-backend setup
    /*
    const clerkClient = clerk.client({ apiKey: process.env.CLERK_API_KEY })
    await clerkClient.users.updateUser(user.externalId, {
      privateMetadata: {
        ...user.privateMetadata,
        isSuperAdmin: updates.isSuperAdmin, 
        isSuperUser: updates.isSuperUser
      }
    })
    */
    
    return { success: true }
  }
})


