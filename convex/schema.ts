// convex/schema.ts

import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  users: defineTable({
    name: v.string(),
    // this the Clerk ID, stored in the subject JWT field
    externalId: v.string()
  }).index('byExternalId', ['externalId']),

  organizations: defineTable({
    name: v.string(),
    externalId: v.string() // Clerk organization ID
  }).index('byExternalId', ['externalId']),

  organizationMemberships: defineTable({
    userId: v.id('users'),
    organizationId: v.id('organizations'),
    role: v.string() // e.g., "admin", "member"
  })
    .index('byUser', ['userId'])
    .index('byOrganization', ['organizationId'])
    .index('byUserAndOrganization', ['userId', 'organizationId'])
})
