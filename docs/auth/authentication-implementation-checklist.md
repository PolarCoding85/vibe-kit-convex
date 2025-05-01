# Authentication Implementation Checklist: Convex, Clerk, and Next.js

This document outlines the necessary steps to align our Convex, Clerk, and
Next.js authentication setup with industry best practices. It serves as a
comprehensive checklist to ensure our system is secure, maintainable, and
follows the DRY (Don't Repeat Yourself) principle.

## 1. Backend Authentication Utilities

### Create Authentication Utility Functions

- [x] Implement `ConvexError` for consistent error handling

  ```typescript
  import { ConvexError } from 'convex/values'
  ```

- [x] Create an `AuthenticationRequired` utility function

  ```typescript
  // convex/util/auth.ts
  import { QueryCtx, MutationCtx, ActionCtx } from '../_generated/server'
  import { ConvexError } from 'convex/values'

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
  ```

- [x] Create function to get authorized user with proper error handling
  ```typescript
  export async function getAuthenticatedUser(ctx) {
    const identity = await AuthenticationRequired({ ctx })
    const user = await userByExternalId(ctx, identity.subject)
    if (!user) {
      throw new ConvexError('User not found in database')
    }
    return user
  }
  ```

### Implement Custom Function Wrappers

- [x] Create `customQuery`, `customMutation`, and `customAction` wrappers

  ```typescript
  // convex/util/customFunctions.ts
  import {
    customQuery,
    customMutation,
    customAction,
    customCtx
  } from 'convex-helpers/server/customFunctions'
  import { query, mutation, action } from '../_generated/server'
  import { AuthenticationRequired } from './auth'

  /** Custom query that requires authentication */
  export const authQuery = customQuery(
    query,
    customCtx(async ctx => {
      await AuthenticationRequired({ ctx })
      return {}
    })
  )

  /** Custom mutation that requires authentication */
  export const authMutation = customMutation(
    mutation,
    customCtx(async ctx => {
      await AuthenticationRequired({ ctx })
      return {}
    })
  )

  /** Custom action that requires authentication */
  export const authAction = customAction(
    action,
    customCtx(async ctx => {
      await AuthenticationRequired({ ctx })
      return {}
    })
  )
  ```

## 2. Complete Missing Implementation

### Implement Memberships Module

- [x] Create `upsertFromClerk` function in `memberships.ts`

  ```typescript
  // Logic to create/update organization memberships from Clerk data
  export const upsertFromClerk = internalMutation({
    args: { data: v.any() }, // Organization Membership data from Clerk
    async handler(ctx, { data }) {
      // Implementation details
    }
  })
  ```

- [x] Create `deleteFromClerk` function in `memberships.ts`
  ```typescript
  // Logic to delete organization memberships from Clerk
  export const deleteFromClerk = internalMutation({
    args: { id: v.string() },
    async handler(ctx, { id }) {
      // Implementation details
    }
  })
  ```

### Implement Organization Deletion

- [x] Add `deleteFromClerk` function in `organizations.ts`
  ```typescript
  // Logic to delete organizations from Clerk
  export const deleteFromClerk = internalMutation({
    args: { id: v.string() },
    async handler(ctx, { id }) {
      // Implementation details
    }
  })
  ```

## 3. Refactor Existing Functions

### Update User Functions

- [x] Refactor `getCurrentUser` to use proper error handling

  ```typescript
  // Update with ConvexError instead of generic Error
  export async function getCurrentUserOrThrow(ctx: QueryCtx) {
    const userRecord = await getCurrentUser(ctx)
    if (!userRecord) throw new ConvexError("Can't get current user")
    return userRecord
  }
  ```

- [x] Update queries to use the new `authQuery` wrapper
  ```typescript
  // Replace current implementation
  export const current = authQuery({
    args: {},
    handler: async ctx => {
      return await getCurrentUser(ctx)
    }
  })
  ```

### Update Organization Functions

- [x] Refactor `listForUser` to use `authQuery`
  ```typescript
  // Replace current implementation
  export const listForUser = authQuery({
    args: {},
    handler: async ctx => {
      const user = await getCurrentUser(ctx)
      // The rest of the implementation
    }
  })
  ```

## 4. Role-Based Authorization

### Implement Authorization Logic

- [x] Create utility function for checking organization membership

  ```typescript
  // convex/util/auth.ts
  export async function checkOrganizationMembership(
    ctx: QueryCtx | MutationCtx,
    organizationId: Id<'organizations'>
  ) {
    const user = await getAuthenticatedUser(ctx)

    const membership = await ctx.db
      .query('organizationMemberships')
      .withIndex('byUserAndOrganization', q =>
        q.eq('userId', user._id).eq('organizationId', organizationId)
      )
      .unique()

    if (!membership) {
      throw new ConvexError('User is not a member of this organization')
    }

    return membership
  }
  ```

- [x] Create utility function for checking admin permissions

  ```typescript
  export async function requireOrgAdmin(
    ctx: QueryCtx | MutationCtx,
    organizationId: Id<'organizations'>
  ) {
    const membership = await checkOrganizationMembership(ctx, organizationId)

    if (membership.role !== 'admin') {
      throw new ConvexError('This action requires admin permissions')
    }

    return membership
  }
  ```

## 5. Client-Side Authentication

### Create Custom React Hooks

- [x] Create `useAuthenticatedQueryWithStatus` hook

  ```typescript
  // hooks/use-authenticated-query.ts
  import { useConvexAuth } from 'convex/react'
  import { makeUseQueryWithStatus } from 'convex-helpers/react'
  import { FunctionReference } from 'convex/server'
  import { OptionalRestArgsOrSkip } from 'convex/react'

  export const useQueryWithStatus = makeUseQueryWithStatus(useQuery)

  // Wrapper around useQueryWithStatus that checks authentication
  export function useAuthenticatedQueryWithStatus<
    Query extends FunctionReference<'query'>
  >(query: Query, args: OptionalRestArgsOrSkip<Query>[0] | 'skip') {
    const { isAuthenticated } = useConvexAuth()
    return useQueryWithStatus(query, isAuthenticated ? args : 'skip')
  }
  ```

- [x] Create `useAuthenticatedPaginatedQuery` hook

  ```typescript
  // hooks/use-authenticated-query.ts
  import {
    PaginatedQueryArgs,
    PaginatedQueryReference,
    useConvexAuth,
    usePaginatedQuery
  } from 'convex/react'

  // Wrapper around usePaginatedQuery that checks authentication
  export function useAuthenticatedPaginatedQuery<
    Query extends PaginatedQueryReference
  >(
    query: Query,
    args: PaginatedQueryArgs<Query> | 'skip',
    options: { initialNumItems: number }
  ) {
    const { isAuthenticated } = useConvexAuth()
    return usePaginatedQuery(query, isAuthenticated ? args : 'skip', options)
  }
  ```

- [x] Added additional helper hook `useAuthStatus` for auth state management

  ```typescript
  // hooks/use-auth-status.ts
  export function useAuthStatus() {
    const { isLoading, isAuthenticated } = useConvexAuth()

    return {
      isLoading,
      isAuthenticated,
      isUnauthenticated: !isLoading && !isAuthenticated,
      isAuthenticating: isLoading,
      isReady: !isLoading
    }
  }
  ```

## 6. Next.js Configuration

### Set Up Auth Middleware

- [x] Configure Next.js middleware for route protection

  ```typescript
  // middleware.ts
  import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
  import { NextResponse } from 'next/server'

  const isAdminRoute = createRouteMatcher(['/admin(.*)'])
  const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])
  const isApiRoute = createRouteMatcher(['/api/(.*)'])

  // Check if a role starts with 'org:super_'
  const isSuperRole = (role: string) => role.startsWith('org:super_')

  export default clerkMiddleware(async (auth, req) => {
    const { userId, orgId, orgRole, has } = await auth()

    // API routes need authentication but no redirects
    if (isApiRoute(req)) {
      await auth.protect()
      return NextResponse.next()
    }

    // Check for admin routes first (only super_* roles can access)
    if (isAdminRoute(req)) {
      // If not authenticated, redirect to sign-in
      if (!userId) {
        return NextResponse.redirect(new URL('/sign-in', req.url))
      }

      // Check if user has any super_* role
      const hasSuperRole = orgRole ? isSuperRole(orgRole) : false
      const isSuperAdmin = has({ role: 'org:super_admin' })

      if (!hasSuperRole && !isSuperAdmin) {
        return NextResponse.redirect(new URL('/unauthorized', req.url))
      }
    }

    // For protected routes, check auth & org context
    if (isProtectedRoute(req)) {
      await auth.protect()

      if (!orgId) {
        return NextResponse.redirect(new URL('/my-organizations', req.url))
      }
    }

    return NextResponse.next()
  })

  export const config = {
    matcher: [
      '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
      '/(api|trpc)(.*)'
    ]
  }
  ```

### Set Up Authentication Provider

- [x] Configure Convex Provider with Clerk in your app

  ```tsx
  // providers/convex-client-provider.tsx
  'use client'

  import { ReactNode } from 'react'
  import { useAuth } from '@clerk/nextjs'
  import { ConvexReactClient } from 'convex/react'
  import { ConvexProviderWithClerk } from 'convex/react-clerk'

  // Create the Convex client with optimized configuration
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL

  if (!convexUrl) {
    throw new Error(
      'NEXT_PUBLIC_CONVEX_URL is not defined. Please check your environment variables.'
    )
  }

  const convex = new ConvexReactClient(convexUrl, {
    // Enable warning when there are unsaved changes
    unsavedChangesWarning: true
  })

  /**
   * Provides Convex client with Clerk authentication integration.
   * This component ensures all Convex queries have access to the
   * current auth state and automatically refreshes tokens as needed.
   */
  export function ConvexClientProvider({ children }: { children: ReactNode }) {
    return (
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    )
  }
  ```

  And used in the providers component:

  ```tsx
  // providers/providers.tsx
  'use client'

  import { Toaster } from '@/components/ui/sonner'
  import { ThemeProvider, useTheme } from 'next-themes'
  import { ConvexClientProvider } from './convex-client-provider'

  export default function Providers({
    children
  }: {
    children: React.ReactNode
  }) {
    return (
      <ConvexClientProvider>
        <ThemeProvider
          enableSystem
          attribute='class'
          defaultTheme='dark'
          disableTransitionOnChange
        >
          {children}
          <ToasterProvider />
        </ThemeProvider>
      </ConvexClientProvider>
    )
  }
  ```

## 7. Security Enhancements

### Use Internal Functions for Sensitive Operations

- [x] Review current function visibility and convert appropriate functions to
      internal

  ```typescript
  // For sensitive operations that should never be called from the client
  import { internalMutation } from './_generated/server'

  // Example: Properly using internal mutations for webhook handlers
  export const upsertFromClerk = internalMutation({
    args: { data: v.any() },
    handler: async (ctx, { data }) => {
      // Implementation
    }
  })
  ```

### Add Enhanced Error Handling

- [x] Implement structured error handling with appropriate HTTP status codes

  ```typescript
  // Example of improved error handling in http.ts
  try {
    // Process webhook event
  } catch (processingError) {
    console.error(
      `Error processing webhook event ${event.type}:`,
      processingError
    )
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
  ```

### Add Payload Validation

- [x] Implement type guards and validation for webhook payloads

  ```typescript
  // Example of payload validation for Clerk webhook data
  function validateUserPayload(data: any): data is UserJSON {
    return (
      data &&
      typeof data === 'object' &&
      typeof data.id === 'string' &&
      typeof data.first_name === 'string' &&
      typeof data.last_name === 'string'
    )
  }
  ```

## 8. Extended Webhook Event Handling

### Schema Enhancements

- [x] Update schema to support additional Clerk webhook events

  ```typescript
  // New tables added to schema.ts
  sessions: defineTable({
    externalId: v.string(), // Clerk session ID
    userId: v.id('users'),
    status: v.string(), // "active", "ended", "revoked", etc.
    createdAt: v.string()
    // ... other session fields
  })

  organizationInvitations: defineTable({
    externalId: v.string(), // Clerk invitation ID
    organizationId: v.id('organizations'),
    email: v.string(),
    status: v.string() // "pending", "accepted", "revoked", etc.
    // ... other invitation fields
  })

  webhookEvents: defineTable({
    eventType: v.string(), // e.g., "user.created", "session.ended"
    eventId: v.string(), // Svix event ID
    objectId: v.string() // ID of the affected object
    // ... other audit fields
  })
  ```

### Additional Webhook Handlers

- [x] Add validation for new webhook event types

  ```typescript
  // Example of session payload validation
  function validateSessionPayload(data: any): data is SessionJSON {
    return (
      data &&
      typeof data === 'object' &&
      typeof data.id === 'string' &&
      typeof data.status === 'string' &&
      data.user &&
      typeof data.user === 'object' &&
      typeof data.user.id === 'string'
    )
  }
  ```

- [x] Implement session event handling

  - [x] Create `convex/sessions.ts` module
  - [x] Add `upsertFromClerk` and `endFromClerk` mutations
  - [x] Integrate with webhook handler

  ```typescript
  // sessions.ts - Handling webhook events
  export const upsertFromClerk = internalMutation({
    args: {
      data: v.any(), // Session data from Clerk
      eventType: v.string() // Event type like 'session.created', 'session.ended', etc.
    },
    handler: async (ctx, { data, eventType }) => {
      // Implementation for creating/updating sessions from webhook data
      const sessionData = {
        externalId: data.id,
        userId: user._id,
        status: sessionStatus
        // Other session details
      }

      // Update or create session record
      // Return success status
    }
  })
  ```

- [x] Implement invitation event handling

  - [x] Create `convex/invitations.ts` module
  - [x] Add `upsertFromClerk` and `deleteFromClerk` mutations
  - [x] Integrate with webhook handler

  ```typescript
  // invitations.ts - Handling invitation webhook events
  export const upsertFromClerk = internalMutation({
    args: {
      data: v.any(), // Invitation data from Clerk
      eventType: v.string() // Event type like 'organizationInvitation.created', etc.
    },
    handler: async (ctx, { data, eventType }) => {
      // Determine invitation status based on event type
      let invitationStatus = 'pending'
      if (eventType === 'organizationInvitation.accepted') {
        invitationStatus = 'accepted'
      } else if (eventType === 'organizationInvitation.revoked') {
        invitationStatus = 'revoked'
      }

      // Create or update invitation record
      // Return success status
    }
  })
  ```

- [x] Implement webhook event logging

  - [x] Create `convex/webhookEvents.ts` module
  - [x] Add `logEvent` mutation
  - [x] Enable event history tracking in the webhook handler

  ```typescript
  // webhookEvents.ts - Audit logging for all webhook events
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
      // Return success status
    }
  })
  ```

## 9. Testing

### Verify Authentication Flow

- [ ] Test webhook handler with sample Clerk payloads
- [ ] Test authentication functions with both valid and invalid tokens
- [ ] Test role-based access control with different user roles
- [ ] Test client-side authentication hooks with both authenticated and
      unauthenticated states

## 10. Documentation

### Update API Documentation

- [ ] Document authentication flow and requirements for each endpoint
- [ ] Document required environment variables
- [ ] Document client-side hooks and their usage
- [ ] Document common error codes and their meanings

## Implementation Strategy

For a smooth implementation, follow these steps:

1. First, implement the authentication utility functions and wrappers
2. Complete missing implementations (memberships, organization deletion)
3. Refactor existing functions to use the new utilities
4. Implement role-based authorization
5. Create and integrate client-side authentication hooks
6. Set up Next.js middleware and providers
7. Add security enhancements
8. Test thoroughly
9. Update documentation

By following this checklist, we'll ensure our authentication system is secure,
maintainable, and follows best practices across all layers of our application.
