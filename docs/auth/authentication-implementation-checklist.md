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
    const { isLoading, isAuthenticated } = useConvexAuth();

    return {
      isLoading,
      isAuthenticated,
      isUnauthenticated: !isLoading && !isAuthenticated,
      isAuthenticating: isLoading,
      isReady: !isLoading
    };
  }
  ```

## 6. Next.js Configuration

### Set Up Auth Middleware

- [ ] Configure Next.js middleware for route protection

  ```typescript
  // middleware.ts
  import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

  const isProtectedRoute = createRouteMatcher([
    '/dashboard(.*)',
    '/organizations(.*)',
    '/settings(.*)'
    // Add more protected routes here
  ])

  export default clerkMiddleware(async (auth, req) => {
    const { userId, redirectToSignIn } = await auth()

    if (!userId && isProtectedRoute(req)) {
      return redirectToSignIn()
    }
  })

  export const config = {
    matcher: [
      // Skip Next.js internals and static files
      '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
      // Always run for API routes
      '/(api|trpc)(.*)'
    ]
  }
  ```

### Set Up Authentication Provider

- [ ] Configure Convex Provider with Clerk in your app

  ```tsx
  // app/providers.tsx
  'use client'

  import { ReactNode } from 'react'
  import { ConvexReactClient } from 'convex/react'
  import { ConvexProviderWithClerk } from 'convex/react-clerk'
  import { ClerkProvider, useAuth } from '@clerk/nextjs'

  const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

  export default function Providers({ children }: { children: ReactNode }) {
    return (
      <ClerkProvider
        publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      >
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          {children}
        </ConvexProviderWithClerk>
      </ClerkProvider>
    )
  }
  ```

## 7. Security Enhancements

### Use Internal Functions for Sensitive Operations

- [ ] Review current function visibility and convert appropriate functions to
      internal
  ```typescript
  // For sensitive operations that should never be called from the client
  import { internalQuery, internalMutation } from './_generated/server'
  ```

### Add Enhanced Error Handling

- [ ] Implement structured error handling with appropriate HTTP status codes
  ```typescript
  // Example improved error handling
  try {
    // Operation that might fail
  } catch (error) {
    if (error instanceof ConvexError) {
      // Handle known errors
      console.error(`Authentication error: ${error.message}`)
    } else {
      // Handle unexpected errors
      console.error('Unexpected error:', error)
      throw new ConvexError('An unexpected error occurred')
    }
  }
  ```

## 8. Testing

### Verify Authentication Flow

- [ ] Test webhook handler with sample Clerk payloads
- [ ] Test authentication functions with both valid and invalid tokens
- [ ] Test role-based access control with different user roles
- [ ] Test client-side authentication hooks with both authenticated and
      unauthenticated states

## 9. Documentation

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
