// convex/util/customFunctions.ts

import {
  query,
  mutation,
  action,
  QueryCtx,
  MutationCtx,
  ActionCtx
} from '../_generated/server'
import { ConvexError } from 'convex/values'
import {
  customQuery,
  customMutation,
  customAction,
  customCtx
} from 'convex-helpers/server/customFunctions'

/**
 * Checks if a user is authenticated
 */
async function checkAuth(ctx: QueryCtx | MutationCtx | ActionCtx) {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) {
    throw new ConvexError('Not authenticated')
  }
  return identity
}

/**
 * Custom query that requires authentication
 */
export const authQuery = customQuery(
  query,
  customCtx(async ctx => {
    await checkAuth(ctx)
    return {}
  })
)

/**
 * Custom mutation that requires authentication
 */
export const authMutation = customMutation(
  mutation,
  customCtx(async ctx => {
    await checkAuth(ctx)
    return {}
  })
)

/**
 * Custom action that requires authentication
 */
export const authAction = customAction(
  action,
  customCtx(async ctx => {
    await checkAuth(ctx)
    return {}
  })
)
