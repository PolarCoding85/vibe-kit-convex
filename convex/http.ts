// convex/http.ts

import { httpRouter } from 'convex/server'
import { httpAction } from './_generated/server'
import { internal } from './_generated/api'
import { Id } from './_generated/dataModel'
import type {
  UserJSON,
  OrganizationJSON,
  OrganizationMembershipJSON,
  WebhookEvent,
  SessionJSON,
  OrganizationInvitationJSON
} from '@clerk/backend'
import { Webhook } from 'svix'

const http = httpRouter()

/**
 * Clerk webhook handler for user, organization, and membership events
 * Security: Validates Svix signatures and performs basic payload validation
 */
http.route({
  path: '/clerk-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    try {
      // Validate webhook signature
      const { event, error } = await validateRequest(request)

      if (error || !event) {
        console.error('Webhook validation failed:', error)
        return new Response(
          JSON.stringify({ error: error || 'Invalid webhook payload' }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      }

      // Declare eventLogId in outer scope with proper type to make it available in error handling
      let eventLogId: Id<'clerkWebhookEvents'> | undefined;
      
      // Process by event type
      try {
        // Log the webhook event for audit purposes with initial 'processing' status
        try {
          const logResult = await ctx.runMutation(
            internal.clerkWebhookEvents.logEvent,
            {
              eventType: event.type,
              eventId: (event as any).svix_id || event.type + '-' + Date.now(), // Use a fallback ID if svix_id is not available
              objectId: event.data.id || '',
              objectType: event.type.split('.')[0],
              timestamp: new Date().toISOString(),
              data: event.data,
              status: 'processing'
            }
          )
          eventLogId = logResult.eventId
        } catch (loggingError) {
          console.error('Failed to log webhook event:', loggingError)
          // Continue processing even if logging fails
        }

        // Pre-process any session events, including those not explicitly defined in Clerk's types
        if (event.type.startsWith('session.')) {
          if (!validateSessionPayload(event.data)) {
            throw new Error('Invalid session payload structure')
          }

          // Log session events that aren't in the official Clerk event types
          if (
            ![
              'session.created',
              'session.removed',
              'session.revoked',
              'session.ended'
            ].includes(event.type)
          ) {
            console.log(
              `Processing non-standard session event: ${event.type} for session: ${event.data.id}`
            )
          }

          // Extract event attributes including client IP and user agent
          const eventAttributes = (event as any).event_attributes || {}

          // Process all session events with the same handler
          await ctx.runMutation(internal.sessions.upsertFromClerk, {
            data: event.data,
            eventType: event.type,
            eventAttributes // Pass through the event attributes which contain client IP and user agent
          })

          // Update event status to processed
          if (eventLogId) {
            try {
              await ctx.runMutation(
                internal.clerkWebhookEvents.updateEventStatus,
                {
                  eventId: eventLogId,
                  status: 'processed'
                }
              )
            } catch (statusUpdateError) {
              console.error(
                'Failed to update webhook event status:',
                statusUpdateError
              )
              // Continue anyway, this is just logging
            }
          }

          // Send success response for session events
          return new Response(JSON.stringify({ status: 'success' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          })
        }

        // Process all other event types
        switch (event.type) {
          // User events
          case 'user.created':
          case 'user.updated':
            if (!validateUserPayload(event.data)) {
              throw new Error('Invalid user payload structure')
            }
            await ctx.runMutation(internal.users.upsertFromClerk, {
              data: event.data
            })
            break

          case 'user.deleted': {
            if (!event.data.id) {
              throw new Error('Missing user ID in deletion event')
            }
            const userId = event.data.id
            await ctx.runMutation(internal.users.deleteFromClerk, {
              clerkUserId: userId
            })
            break
          }

          // Note: Permission and role events are handled later in this switch statement

          // Organization events
          case 'organization.created':
          case 'organization.updated':
            if (!validateOrganizationPayload(event.data)) {
              throw new Error('Invalid organization payload structure')
            }
            await ctx.runMutation(internal.organizations.upsertFromClerk, {
              data: event.data,
              eventType: event.type
            })
            break

          case 'organization.deleted': {
            if (!event.data.id) {
              throw new Error('Missing organization ID in deletion event')
            }
            const orgId = event.data.id
            await ctx.runMutation(internal.organizations.deleteFromClerk, {
              id: orgId
            })
            break
          }

          // Organization invitation events
          case 'organizationInvitation.created':
          case 'organizationInvitation.accepted':
          case 'organizationInvitation.revoked':
            if (!validateInvitationPayload(event.data)) {
              throw new Error('Invalid invitation payload structure')
            }

            // Extract event attributes including creator information from request data
            const eventAttributes = (event as any).event_attributes || {}

            await ctx.runMutation(internal.invitations.upsertFromClerk, {
              data: event.data,
              eventType: event.type,
              eventAttributes // Pass through the event attributes which may contain creator info
            })
            break

          // Organization membership events
          case 'organizationMembership.created':
          case 'organizationMembership.updated':
            if (!validateMembershipPayload(event.data)) {
              throw new Error('Invalid membership payload structure')
            }
            await ctx.runMutation(internal.memberships.upsertFromClerk, {
              data: event.data,
              eventType: event.type
            })
            break

          case 'organizationMembership.deleted': {
            if (!event.data.id) {
              throw new Error('Missing membership ID in deletion event')
            }
            const membershipId = event.data.id
            await ctx.runMutation(internal.memberships.deleteFromClerk, {
              id: membershipId
            })
            break
          }

          // Permission events
          case 'permission.created':
          case 'permission.updated':
            if (!validatePermissionPayload(event.data)) {
              throw new Error('Invalid permission payload structure')
            }
            await ctx.runMutation(internal.permissions.upsertFromClerk, {
              data: event.data,
              eventType: event.type
            })
            break

          case 'permission.deleted': {
            if (!event.data.id) {
              throw new Error('Missing permission ID in deletion event')
            }
            const permissionId = event.data.id
            await ctx.runMutation(internal.permissions.deleteFromClerk, {
              id: permissionId
            })
            break
          }

          // Role events
          case 'role.created':
          case 'role.updated':
            if (!validateRolePayload(event.data)) {
              throw new Error('Invalid role payload structure')
            }
            await ctx.runMutation(internal.roles.upsertFromClerk, {
              data: event.data,
              eventType: event.type
            })
            break

          case 'role.deleted': {
            if (!event.data.id) {
              throw new Error('Missing role ID in deletion event')
            }
            const roleId = event.data.id
            await ctx.runMutation(internal.roles.deleteFromClerk, {
              id: roleId
            })
            break
          }

          default:
            console.log('Received unhandled Clerk webhook event:', event.type)

            // Update status for unhandled events as 'ignored'
            if (eventLogId) {
              try {
                await ctx.runMutation(
                  internal.clerkWebhookEvents.updateEventStatus,
                  {
                    eventId: eventLogId,
                    status: 'ignored'
                  }
                )
              } catch (statusUpdateError) {
                console.error(
                  'Failed to update webhook event status:',
                  statusUpdateError
                )
              }
            }

            // Success response for unhandled events to prevent retries
            return new Response(
              JSON.stringify({ status: 'ignored', eventType: event.type }),
              {
                status: 202,
                headers: { 'Content-Type': 'application/json' }
              }
            )
        }

        // Update event status to processed for all successfully handled events
        if (eventLogId) {
          try {
            await ctx.runMutation(
              internal.clerkWebhookEvents.updateEventStatus,
              {
                eventId: eventLogId,
                status: 'processed'
              }
            )
          } catch (statusUpdateError) {
            console.error(
              'Failed to update webhook event status:',
              statusUpdateError
            )
            // Continue anyway, this is just for logging
          }
        }

        return new Response(JSON.stringify({ status: 'success' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      } catch (processingError) {
        console.error(
          `Error processing webhook event ${event.type}:`,
          processingError
        )

        // Update event status to failed
        if (eventLogId) {
          try {
            await ctx.runMutation(
              internal.clerkWebhookEvents.updateEventStatus,
              {
                eventId: eventLogId,
                status: 'failed',
                errorMessage: String(processingError)
              }
            )
          } catch (statusUpdateError) {
            console.error(
              'Failed to update webhook event status:',
              statusUpdateError
            )
          }
        }

        return new Response(
          JSON.stringify({
            error: 'Processing error',
            details: String(processingError),
            eventType: event.type
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      }
    } catch (outerError) {
      console.error('Unexpected webhook handler error:', outerError)
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  })
})

/**
 * Validates a webhook request from Clerk/Svix
 * Returns the event object if valid, or an error message if invalid
 */
async function validateRequest(
  req: Request
): Promise<{ event: WebhookEvent | null; error: string | null }> {
  try {
    const body = await req.text()
    const rawBody = body

    // Extract Svix headers
    const svixId = req.headers.get('svix-id')
    const svixTimestamp = req.headers.get('svix-timestamp')
    const svixSignature = req.headers.get('svix-signature')

    if (!svixId || !svixTimestamp || !svixSignature) {
      return { event: null, error: 'Missing svix headers' }
    }

    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET
    if (!webhookSecret) {
      return { event: null, error: 'Missing webhook secret' }
    }

    // Create Webhook instance with secret
    const wh = new Webhook(webhookSecret)

    // Verify the payload with headers
    const evt = await wh.verify(rawBody, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature
    })

    // Verification successful, return the event
    return { event: evt as WebhookEvent, error: null }
  } catch (err) {
    return { event: null, error: String(err) }
  }
}

/**
 * Validates a user payload from Clerk
 */
function validateUserPayload(data: any): data is UserJSON {
  return (
    data && typeof data === 'object' && typeof data.id === 'string'
    // Note: We don't check more fields to make this more robust
  )
}

/**
 * Validates a session payload from Clerk
 * Made more flexible to handle different session formats
 */
function validateSessionPayload(data: any): data is SessionJSON {
  // Basic validation - must be an object with ID
  const hasBasicFields =
    data && typeof data === 'object' && typeof data.id === 'string'

  if (!hasBasicFields) return false

  // Session status is usually present but might be omitted in some events
  // So we only check if it's a string when it exists
  if (data.status !== undefined && typeof data.status !== 'string') {
    return false
  }

  // User info might be in different formats:
  // 1. As a nested user object (data.user.id)
  // 2. As a flat user_id field (data.user_id)
  // 3. Missing entirely for some event types (session.removed)

  // Check for nested user object if present
  if (data.user !== undefined) {
    // If user is present, it should be an object with an ID
    if (
      typeof data.user !== 'object' ||
      !data.user ||
      typeof data.user.id !== 'string'
    ) {
      // Check if flat user_id exists instead
      if (typeof data.user_id !== 'string') {
        return false
      }
    }
  } else if (data.user_id === undefined) {
    // No user object and no user_id field
    // We'll accept this since event type validation happens in the handler
    // The handler already has logic to handle missing user info
  }

  // If we've passed all checks, the structure is valid enough
  return true
}

/**
 * Validates an organization payload from Clerk
 */
function validateOrganizationPayload(data: any): data is OrganizationJSON {
  // For deletion events, we only need the id field
  if (data.deleted === true) {
    return data && typeof data === 'object' && typeof data.id === 'string'
  }

  // For creation and update events, we need more fields
  return (
    data &&
    typeof data === 'object' &&
    typeof data.id === 'string' &&
    typeof data.name === 'string'
  )
}

/**
 * Validates an organization invitation payload from Clerk
 * Handles all invitation event types with more flexible validation
 */
function validateInvitationPayload(
  data: any
): data is OrganizationInvitationJSON {
  // Basic required fields for all invitation types
  const hasBasicFields =
    data &&
    typeof data === 'object' &&
    typeof data.id === 'string' &&
    typeof data.email_address === 'string'

  if (!hasBasicFields) return false

  // Check organization format - could be direct ID or nested object
  const hasValidOrganization =
    // Either has organization_id as string (simplified format)
    typeof data.organization_id === 'string' ||
    // Or has organization object with id
    (data.organization &&
      typeof data.organization === 'object' &&
      typeof data.organization.id === 'string')

  // Check role format (should be string)
  const hasValidRole = typeof data.role === 'string'

  // For all invitation events we need organization and role
  return hasValidOrganization && hasValidRole
}

/**
 * Validates an organization membership payload from Clerk
 * Handles both creation/update and deletion events
 */
function validateMembershipPayload(
  data: any
): data is OrganizationMembershipJSON {
  // For all membership events, we need these fields
  const hasBasicFields =
    data && typeof data === 'object' && typeof data.id === 'string'

  if (!hasBasicFields) return false

  // For created/updated events, we need organization, role, and user data
  const hasDetailFields =
    typeof data.role === 'string' &&
    data.organization &&
    typeof data.organization === 'object' &&
    typeof data.organization.id === 'string' &&
    data.public_user_data &&
    typeof data.public_user_data === 'object' &&
    typeof data.public_user_data.user_id === 'string'

  // This should always be true for created/updated events,
  // but might be false for deleted events where less data is provided
  return hasDetailFields
}

/**
 * Validates a permission payload from Clerk
 * Handles both creation/update and deletion events
 */
function validatePermissionPayload(data: any): data is any {
  // Check for basic required fields in all permission types
  const hasBasicFields =
    data && typeof data === 'object' && typeof data.id === 'string'

  if (!hasBasicFields) return false

  // For deleted events, we just need the id and deleted flag
  if (data.deleted === true) {
    return true
  }

  // For created/updated events, we need additional fields
  return (
    typeof data.key === 'string' &&
    typeof data.name === 'string' &&
    typeof data.type === 'string'
  )
}

/**
 * Validates a role payload from Clerk
 * Handles both creation/update and deletion events
 */
function validateRolePayload(data: any): data is any {
  // Check for basic required fields in all role types
  const hasBasicFields =
    data && typeof data === 'object' && typeof data.id === 'string'

  if (!hasBasicFields) return false

  // For deleted events, we just need the id and deleted flag
  if (data.deleted === true) {
    return true
  }

  // For created/updated events, we need additional fields
  const hasRequiredFields =
    typeof data.key === 'string' && typeof data.name === 'string'

  // For roles, the permissions field is an array but might be empty
  const hasValidPermissions =
    !data.permissions || Array.isArray(data.permissions)

  return hasRequiredFields && hasValidPermissions
}

export default http
