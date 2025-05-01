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
    eventType: v.string(), // Event type like 'session.created', 'session.ended', etc.
    eventAttributes: v.optional(v.any()) // Optional event_attributes from the webhook containing client IP and user agent
  },
  handler: async (ctx, { data, eventType, eventAttributes }) => {
    // Extract the user ID from either data.user.id or data.user_id (different Clerk formats)
    const userId = data.user?.id || data.user_id
    
    // If we still don't have a user ID, handle specially
    if (!userId) {
      if (eventType === 'session.removed') {
        // For removed sessions without user info, try to find and update directly
        const existingSession = await ctx.db
          .query('sessions')
          .withIndex('byExternalId', q => q.eq('externalId', data.id))
          .unique()
        
        if (existingSession) {
          // Update the session status
          await ctx.db.patch(existingSession._id, {
            status: 'removed',
            endedAt: new Date().toISOString()
          })
          return { success: true, sessionId: existingSession._id }
        }
      }
      console.warn(`Cannot process session: Missing user information in ${eventType} event`)
      return { success: false, reason: 'missing_user_info' }
    }
    
    // Find the user this session belongs to
    let userRecord = await ctx.db
      .query('users')
      .withIndex('byExternalId', q => q.eq('externalId', userId))
      .unique()

    if (!userRecord) {
      // If the user doesn't exist yet, this is a race condition where the session.created
      // webhook arrived before the user.created webhook. Create a placeholder user.
      console.log(`Creating placeholder user for session user ${userId}`)
      const placeholderUserId = await ctx.db.insert('users', {
        externalId: userId,
        name: 'Placeholder User',
        createdAt: new Date().toISOString(),
        publicMetadata: { isPlaceholder: true }
      })
      
      // Get the newly created user
      userRecord = await ctx.db.get(placeholderUserId)
      // This should never happen, but to satisfy TypeScript
      if (!userRecord) {
        throw new Error(`Failed to create placeholder user for ${userId}`)
      }
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

    // Helper to convert timestamps (which can be numbers or strings) to ISO strings
    const toISOString = (timestamp: any): string => {
      if (timestamp === undefined || timestamp === null) {
        return now;
      }
      if (typeof timestamp === 'number') {
        return new Date(timestamp).toISOString();
      }
      if (typeof timestamp === 'string') {
        // Check if it's already ISO format
        if (timestamp.includes('T') && timestamp.includes('Z')) {
          return timestamp;
        }
        // Try to convert it (could be a different string format)
        return new Date(timestamp).toISOString();
      }
      return now; // Default fallback
    };

    // Extract HTTP request info from event attributes if available
    let clientIp: string | undefined = undefined;
    let userAgent: string | undefined = undefined;
    
    if (eventAttributes && typeof eventAttributes === 'object') {
      const httpRequest = eventAttributes.http_request;
      if (httpRequest && typeof httpRequest === 'object') {
        // Get client IP address
        if (typeof httpRequest.client_ip === 'string') {
          clientIp = httpRequest.client_ip;
        }
        
        // Get user agent string
        if (typeof httpRequest.user_agent === 'string') {
          userAgent = httpRequest.user_agent;
        }
      }
    }
    
    // Parse user agent for browser and device info (simple detection)
    let detectedBrowser: string | undefined = undefined;
    let detectedDeviceType: string | undefined = undefined;
    
    if (userAgent) {
      // Simple browser detection
      if (userAgent.includes('Chrome')) {
        detectedBrowser = 'Chrome';
      } else if (userAgent.includes('Firefox')) {
        detectedBrowser = 'Firefox';
      } else if (userAgent.includes('Safari')) {
        detectedBrowser = 'Safari';
      } else if (userAgent.includes('Edge')) {
        detectedBrowser = 'Edge';
      }
      
      // Simple device type detection
      if (userAgent.includes('Mobile')) {
        detectedDeviceType = 'mobile';
      } else {
        detectedDeviceType = 'desktop';
      }
    }
    
    const sessionData = {
      externalId: data.id,
      userId: userRecord._id,
      status: sessionStatus,
      createdAt: toISOString(data.created_at),
      lastActiveAt: toISOString(data.last_active_at),
      endedAt:
        eventType.includes('ended') || eventType.includes('revoked') || eventType.includes('removed')
          ? now
          : undefined,
      // Client details from both direct data and event attributes
      deviceType: data.device?.type || detectedDeviceType,
      browserName: data.device?.browser_name || detectedBrowser,
      clientId: data.client_id,
      ipAddress: data.ip_address || clientIp
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
