// convex/sessions.ts

import { v, ConvexError } from 'convex/values'
import { internalMutation } from './_generated/server'
import { authQuery } from './util/customFunctions'
import { Id } from './_generated/dataModel'

/**
 * Create or update a session from Clerk's webhook data
 */
export const upsertFromClerk = internalMutation({
  args: {
    data: v.any(), // Session data from Clerk
    eventType: v.string() // Event type like 'session.created', 'session.ended', etc.
  },
  handler: async (ctx, { data, eventType }) => {
    // First, find the user this session belongs to
    const user = await ctx.db
      .query('users')
      .withIndex('byExternalId', q => q.eq('externalId', data.user.id))
      .unique()

    if (!user) {
      console.warn(`Cannot create session: User ${data.user.id} not found`)
      return { success: false, reason: 'user_not_found' }
    }

    // Check for existing session
    const existingSession = await ctx.db
      .query('sessions')
      .withIndex('byExternalId', q => q.eq('externalId', data.id))
      .unique()

    // Prepare session data
    const now = new Date().toISOString()
    let sessionStatus = data.status || 'active'

    // Determine status based on event type
    if (eventType === 'session.ended') {
      sessionStatus = 'ended'
    } else if (eventType === 'session.revoked') {
      sessionStatus = 'revoked'
    } else if (eventType === 'session.removed') {
      sessionStatus = 'removed'
    } else if (eventType === 'session.pending') {
      sessionStatus = 'pending'
    }

    const sessionData = {
      externalId: data.id,
      userId: user._id,
      status: sessionStatus,
      createdAt: data.created_at || now,
      lastActiveAt: data.last_active_at || now,
      endedAt:
        eventType.includes('ended') || eventType.includes('revoked')
          ? now
          : undefined,
      // Client details if available
      deviceType: data.device?.type,
      browserName: data.device?.browser_name,
      clientId: data.client_id,
      ipAddress: data.ip_address
    }

    if (existingSession) {
      // Update existing session
      await ctx.db.patch(existingSession._id, sessionData)
      return { success: true, sessionId: existingSession._id }
    } else {
      // Create new session
      const newSessionId = await ctx.db.insert('sessions', sessionData)
      return { success: true, sessionId: newSessionId }
    }
  }
})

/**
 * End a session (mark as ended, revoked, or removed)
 */
export const endFromClerk = internalMutation({
  args: {
    sessionId: v.string(),
    eventType: v.string()
  },
  handler: async (ctx, { sessionId, eventType }) => {
    const session = await ctx.db
      .query('sessions')
      .withIndex('byExternalId', q => q.eq('externalId', sessionId))
      .unique()

    if (!session) {
      console.warn(`Cannot end session: Session with ID ${sessionId} not found`)
      return { success: false, reason: 'session_not_found' }
    }

    let status = 'ended'
    if (eventType === 'session.revoked') {
      status = 'revoked'
    } else if (eventType === 'session.removed') {
      status = 'removed'
    }

    await ctx.db.patch(session._id, {
      status,
      endedAt: new Date().toISOString()
    })

    return { success: true }
  }
})

/**
 * Get all sessions for the current user
 */
export const forCurrentUser = authQuery({
  args: {
    status: v.optional(v.string())
  },
  handler: async (ctx, { status }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      return []
    }

    const user = await ctx.db
      .query('users')
      .withIndex('byExternalId', q => q.eq('externalId', identity.subject))
      .unique()

    if (!user) {
      return []
    }

    // Query sessions by user ID
    let sessionsQuery = ctx.db
      .query('sessions')
      .withIndex('byUser', q => q.eq('userId', user._id))

    // If status filter is provided, apply it
    if (status) {
      sessionsQuery = ctx.db
        .query('sessions')
        .withIndex('byUserAndStatus', q =>
          q.eq('userId', user._id).eq('status', status)
        )
    }

    return await sessionsQuery.collect()
  }
})

/**
 * Get active sessions count for a user
 */
export const getActiveSessionsCount = authQuery({
  args: { userId: v.optional(v.id('users')) },
  handler: async (ctx, { userId }) => {
    // If no user ID provided, get for the current user
    let targetUserId: Id<'users'>

    if (userId) {
      targetUserId = userId
    } else {
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

      targetUserId = user._id
    }

    // Count active sessions
    const sessions = await ctx.db
      .query('sessions')
      .withIndex('byUserAndStatus', q =>
        q.eq('userId', targetUserId).eq('status', 'active')
      )
      .collect()

    return sessions.length
  }
})
