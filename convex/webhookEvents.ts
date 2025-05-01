// convex/webhookEvents.ts

import { v } from 'convex/values'
import { internalMutation } from './_generated/server'
import { authQuery } from './util/customFunctions'

/**
 * Log a webhook event for audit purposes
 */
export const logEvent = internalMutation({
  args: {
    eventType: v.string(), // e.g. "user.created"
    eventId: v.string(), // Svix event ID
    objectId: v.string(), // ID of the object (user, session, etc.)
    objectType: v.string(), // Type of object (user, session, etc.)
    timestamp: v.string(), // When the event occurred
    data: v.any(), // Full event payload
    status: v.string() // "processing", "processed", "failed"
  },
  handler: async (ctx, args) => {
    // Store the event in the database
    const eventId = await ctx.db.insert('webhookEvents', {
      eventType: args.eventType,
      eventId: args.eventId,
      objectId: args.objectId,
      objectType: args.objectType,
      timestamp: args.timestamp,
      data: args.data,
      status: args.status,
      errorMessage: undefined
    })

    return { success: true, eventId }
  }
})

/**
 * Update a webhook event status, typically for marking as processed or failed
 */
export const updateEventStatus = internalMutation({
  args: {
    eventId: v.id('webhookEvents'),
    status: v.string(),
    errorMessage: v.optional(v.string())
  },
  handler: async (ctx, { eventId, status, errorMessage }) => {
    await ctx.db.patch(eventId, {
      status,
      errorMessage
    })

    return { success: true }
  }
})

/**
 * Get recent webhook events for admin purposes
 * This requires admin privileges because it contains sensitive data
 */
export const getRecentEvents = authQuery({
  args: {
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const { limit = 50 } = args
    // First make sure this user has admin privileges
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      return []
    }

    // Check for admin role in claims
    const isAdmin =
      identity.tokenIdentifier.includes('admin') ||
      identity.tokenIdentifier.includes('super')

    if (!isAdmin) {
      // Only return empty list for non-admins
      return []
    }

    // Get recent events - no sorting for now to avoid TypeScript issues
    const events = await ctx.db.query('webhookEvents').collect()

    // Manual sorting by timestamp
    return events
      .sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1))
      .slice(0, limit)
  }
})

/**
 * Get webhook events for a specific object (user, organization, etc.)
 */
export const getEventsForObject = authQuery({
  args: {
    objectId: v.string(),
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const { objectId, limit = 20 } = args
    // Get events for this object ID
    const allEvents = await ctx.db.query('webhookEvents').collect()

    // Manual filtering by objectId
    return allEvents
      .filter(event => event.objectId === objectId)
      .slice(0, limit)
  }
})

/**
 * Get events of a specific type (for analysis/debugging)
 */
export const getEventsByType = authQuery({
  args: {
    eventType: v.string(),
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const { eventType, limit = 20 } = args
    // First make sure this user has admin privileges
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      return []
    }

    // Check for admin role in claims
    const isAdmin =
      identity.tokenIdentifier.includes('admin') ||
      identity.tokenIdentifier.includes('super')

    if (!isAdmin) {
      // Only return empty list for non-admins
      return []
    }

    // Get events of this type
    const allEvents = await ctx.db.query('webhookEvents').collect()

    // Manual filtering by eventType
    return allEvents
      .filter(event => event.eventType === eventType)
      .slice(0, limit)
  }
})
