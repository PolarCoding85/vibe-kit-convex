// convex/schema.ts

import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  // Core entities
  users: defineTable({
    name: v.string(),
    // this the Clerk ID, stored in the subject JWT field
    externalId: v.string(),

    // Basic user information
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.optional(v.string()),
    username: v.optional(v.string()),

    // Image URLs
    imageUrl: v.optional(v.string()), // General image URL
    profileImageUrl: v.optional(v.string()), // Specific profile image URL

    // Timestamps
    createdAt: v.optional(v.string()), // When the user was created in Clerk
    updatedAt: v.optional(v.string()), // When the user was last updated in Clerk
    lastSignInAt: v.optional(v.string()), // When the user last signed in

    // Account status information
    emailVerified: v.optional(v.boolean()), // Whether the primary email is verified
    hasPassword: v.optional(v.boolean()), // Whether the user has set a password
    twoFactorEnabled: v.optional(v.boolean()), // Whether 2FA is enabled
    isSuperAdmin: v.optional(v.boolean()), // Whether the user is a super admin
    isSuperUser: v.optional(v.boolean()), // Whether the user is a super user

    // Metadata from Clerk
    publicMetadata: v.optional(v.any()), // Public metadata (visible to frontend)
    privateMetadata: v.optional(v.any()), // Private metadata (backend only)
    externalSystemId: v.optional(v.string()) // External system ID if connected
  }).index('byExternalId', ['externalId']),

  organizations: defineTable({
    name: v.string(),
    externalId: v.string(), // Clerk organization ID

    // Image URLs
    imageUrl: v.optional(v.string()), // General image URL
    logoUrl: v.optional(v.string()), // Organization logo URL

    // Timestamps
    createdAt: v.optional(v.string()), // When the organization was created
    updatedAt: v.optional(v.string()), // When the organization was last updated

    // Additional information
    slug: v.optional(v.string()), // URL-friendly name
    createdBy: v.optional(v.string()), // Clerk ID of the user who created the org

    // Metadata
    publicMetadata: v.optional(v.any()), // Custom public metadata
    privateMetadata: v.optional(v.any()) // Custom private metadata
  }).index('byExternalId', ['externalId']),

  organizationMemberships: defineTable({
    userId: v.id('users'),
    organizationId: v.id('organizations'),
    role: v.string(), // e.g., "admin", "member", "basic_member"

    // Clerk membership ID
    externalId: v.optional(v.string()),

    // Timestamps
    createdAt: v.optional(v.string()), // When the membership was created
    updatedAt: v.optional(v.string()), // When the membership was last updated

    // Additional data
    publicUserData: v.optional(v.any()), // User data attached to the membership
    publicMetadata: v.optional(v.any()), // Any public metadata from Clerk
    privateMetadata: v.optional(v.any()) // Any private metadata from Clerk
  })
    .index('byUser', ['userId'])
    .index('byOrganization', ['organizationId'])
    .index('byUserAndOrganization', ['userId', 'organizationId'])
    .index('byExternalId', ['externalId']),

  // Sessions tracking
  sessions: defineTable({
    // Session details
    externalId: v.string(), // Clerk session ID
    userId: v.id('users'),
    status: v.string(), // "active", "ended", "revoked", etc.
    createdAt: v.string(),
    lastActiveAt: v.optional(v.string()),
    endedAt: v.optional(v.string()),
    // Device/client info from Clerk
    clientId: v.optional(v.string()),
    deviceType: v.optional(v.string()), // "mobile", "desktop", etc.
    browserName: v.optional(v.string()),
    ipAddress: v.optional(v.string())
  })
    .index('byExternalId', ['externalId'])
    .index('byUser', ['userId'])
    .index('byUserAndStatus', ['userId', 'status']),

  // Organization invitations
  organizationInvitations: defineTable({
    // Basic identification
    externalId: v.string(), // Clerk invitation ID
    organizationId: v.id('organizations'),

    // Recipient information
    email: v.string(),

    // Status and role
    status: v.string(), // "pending", "accepted", "revoked", etc.
    role: v.string(), // e.g., "admin", "basic_member"

    // Timestamps
    createdAt: v.string(),
    updatedAt: v.optional(v.string()),

    // Related entities
    createdByUserId: v.optional(v.id('users')), // Who created the invitation
    orgExternalId: v.optional(v.string()), // Organization's Clerk ID

    // Additional data
    publicMetadata: v.optional(v.any()), // Public metadata from Clerk
    privateMetadata: v.optional(v.any()), // Private metadata from Clerk
    publicUserData: v.optional(v.any()) // User data if available
  })
    .index('byExternalId', ['externalId'])
    .index('byOrganization', ['organizationId'])
    .index('byEmail', ['email'])
    .index('byOrganizationAndStatus', ['organizationId', 'status']),

  // Permissions from Clerk
  permissions: defineTable({
    // Basic identification
    externalId: v.string(), // Clerk permission ID
    key: v.string(), // Permission key (e.g., 'org:billing:manage')

    // Descriptive information
    name: v.string(), // Human-readable name
    description: v.optional(v.string()), // Optional description
    type: v.string(), // Permission type (e.g., 'user', 'organization')

    // Timestamps
    createdAt: v.string(), // When the permission was created
    updatedAt: v.optional(v.string()), // When the permission was last updated

    // Additional metadata
    publicMetadata: v.optional(v.any()), // Any public metadata
    privateMetadata: v.optional(v.any()) // Any private metadata
  })
    .index('byExternalId', ['externalId'])
    .index('byKey', ['key']),

  // Roles from Clerk
  roles: defineTable({
    // Basic identification
    externalId: v.string(), // Clerk role ID
    key: v.string(), // Role key (e.g., 'org:admin')

    // Descriptive information
    name: v.string(), // Human-readable name
    description: v.optional(v.string()), // Optional description
    isCreatorEligible: v.optional(v.boolean()), // Whether org creators get this role

    // Timestamps
    createdAt: v.string(), // When the role was created
    updatedAt: v.optional(v.string()), // When the role was last updated

    // Permissions attached to this role
    permissionIds: v.optional(v.array(v.id('permissions'))), // Internal permission IDs
    permissionExternalIds: v.optional(v.array(v.string())), // Clerk permission IDs

    // Additional metadata
    publicMetadata: v.optional(v.any()), // Any public metadata
    privateMetadata: v.optional(v.any()) // Any private metadata
  })
    .index('byExternalId', ['externalId'])
    .index('byKey', ['key']),

  // Clerk Webhook events log - useful for debugging and auditing
  clerkWebhookEvents: defineTable({
    eventType: v.string(), // e.g., "user.created", "session.ended"
    eventId: v.string(), // Svix event ID
    objectId: v.string(), // ID of the affected object (user ID, session ID, etc.)
    objectType: v.string(), // "user", "session", "organization", etc.
    timestamp: v.string(),
    data: v.any(), // Full event payload for reference
    status: v.string(), // "processed", "failed", etc.
    errorMessage: v.optional(v.string())
  })
    .index('byEventId', ['eventId'])
    .index('byObjectId', ['objectId'])
    .index('byEventType', ['eventType'])
    .index('byTimestamp', ['timestamp'])
})
