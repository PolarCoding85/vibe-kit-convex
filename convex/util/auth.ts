// convex/util/auth.ts

import { QueryCtx, MutationCtx, ActionCtx } from '../_generated/server'
import { ConvexError } from 'convex/values'

/**
 * Type guard to check if context has db access
 */
function hasDbAccess(
  ctx: QueryCtx | MutationCtx | ActionCtx
): ctx is QueryCtx | MutationCtx {
  return 'db' in ctx
}

/**
 * Utility function to require authentication in Convex functions.
 * Throws a ConvexError if the user is not authenticated.
 * Returns the identity object if authentication is successful.
 */
export async function AuthenticationRequired({
  ctx
}: {
  ctx: QueryCtx | MutationCtx | ActionCtx
}) {
  const identity = await ctx.auth.getUserIdentity()
  if (identity === null) {
    throw new ConvexError('Not authenticated!')
  }
  return identity
}

/**
 * Gets the authenticated user from the database.
 * Throws a ConvexError if the user is not authenticated or not found in the database.
 */
export async function getAuthenticatedUser(ctx: QueryCtx | MutationCtx) {
  const identity = await AuthenticationRequired({ ctx })
  const user = await userByExternalId(ctx, identity.subject)
  if (!user) {
    throw new ConvexError('User not found in database')
  }
  return user
}

/**
 * Gets a user by their external ID (Clerk ID)
 */
async function userByExternalId(
  ctx: QueryCtx | MutationCtx,
  externalId: string
) {
  return await ctx.db
    .query('users')
    .withIndex('byExternalId', (q: any) => q.eq('externalId', externalId))
    .unique()
}
