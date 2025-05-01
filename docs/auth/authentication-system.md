# Authentication System Documentation

This document provides a comprehensive overview of the authentication system implemented in this application. The system uses Clerk for identity management and Convex for backend data storage and authorization rules.

## Overview

The application implements a multi-layered authentication and authorization system:

1. **Identity Management**: Handled by Clerk, providing user authentication, organization management, and role-based access control.
2. **Backend Authorization**: Implemented in Convex, with helper utilities for enforcing authentication and authorization rules.
3. **Webhook Integration**: Complete Clerk webhook handling for syncing user, session, organization, membership, invitation, permission, and role data.
4. **RBAC System**: Role-based access control with permissions management.

## Authentication Flow

1. Users authenticate with Clerk (sign in, sign up, OAuth, etc.)
2. Clerk provides a JWT token to the frontend
3. The token is automatically passed to Convex via `ConvexProviderWithClerk`
4. Backend functions use auth utilities to verify authentication and authorization

## Auth Utilities

### `auth.ts`

Core authentication utilities:

- `AuthenticationRequired`: Ensures a user is authenticated before accessing a resource
- `getAuthenticatedUser`: Gets the authenticated user from the database
- `userByExternalId`: Utility to find a user by their Clerk ID

```typescript
// Example usage in a Convex function
import { AuthenticationRequired } from './util/auth';

export const myFunction = query({
  handler: async (ctx) => {
    const identity = await AuthenticationRequired({ ctx });
    // User is now authenticated, proceed with function
  }
});
```

### `orgAuth.ts`

Organization-based authorization utilities:

- `checkOrganizationMembership`: Verifies a user belongs to an organization
- `requireOrgAdmin`: Ensures a user has admin privileges in an organization
- `getUserOrganizations`: Gets all organizations a user belongs to

```typescript
// Example: Requiring org admin privileges
import { requireOrgAdmin } from './util/orgAuth';

export const adminOnlyFunction = mutation({
  args: { organizationId: v.id('organizations') },
  handler: async (ctx, args) => {
    // This will throw an error if user is not an admin
    await requireOrgAdmin(ctx, args.organizationId);
    // Proceed with admin-only operation
  }
});
```

### `customFunctions.ts`

Helper wrappers for common auth patterns:

- `authQuery`: Query that requires authentication
- `authMutation`: Mutation that requires authentication
- `authAction`: Action that requires authentication

```typescript
// Example: Using authMutation
import { authMutation } from './util/customFunctions';

export const secureFunction = authMutation({
  args: { /* your args */ },
  handler: async (ctx, args) => {
    // User is guaranteed to be authenticated
    // Proceed with secured operation
  }
});
```

## Webhook Integration

The application implements comprehensive webhook handlers for all Clerk events:

1. **User Events**: Create/update/delete users
2. **Session Events**: Track user sessions
3. **Organization Events**: Manage organizations
4. **Membership Events**: Handle organization memberships
5. **Invitation Events**: Process organization invitations
6. **Permission Events**: Synchronize permissions
7. **Role Events**: Manage roles and their associated permissions

Webhook handlers perform data validation and persist relevant information to the Convex database, ensuring the backend has up-to-date information about users, organizations, and permissions.

## Role-Based Access Control (RBAC)

The system implements a comprehensive RBAC system with:

1. **Roles**: Named collections of permissions (e.g., "admin", "member")
2. **Permissions**: Specific capabilities (e.g., "org:billing:read")
3. **Assignments**: Users are assigned roles within organizations

### Implementing Permission Checks

```typescript
// Example: Checking for a specific permission
export const permissionProtectedFunction = mutation({
  args: { organizationId: v.id('organizations') },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    
    // Get user's roles in this organization
    const membership = await ctx.db
      .query('organizationMemberships')
      .withIndex('byUserAndOrganization', q => 
        q.eq('userId', user._id).eq('organizationId', args.organizationId)
      )
      .unique();
    
    if (!membership) {
      throw new ConvexError('Not a member of this organization');
    }
    
    // Get role with its permissions
    const role = await ctx.db
      .query('roles')
      .withIndex('byKey', q => q.eq('key', membership.role))
      .unique();
    
    // Check if role has the required permission
    const hasPermission = role?.permissionIds?.some(async (permId) => {
      const perm = await ctx.db.get(permId);
      return perm?.key === 'required:permission:key';
    });
    
    if (!hasPermission) {
      throw new ConvexError('Missing required permission');
    }
    
    // Proceed with operation
  }
});
```

## Frontend Integration

The application connects to Clerk and Convex from the frontend using provider components:

```tsx
// From providers/convex-client-provider.tsx
export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}
```

## Best Practices

1. **Always Use Auth Helpers**: Use the provided auth utilities instead of implementing custom checks
2. **Check Permissions, Not Roles**: When possible, check for specific permissions rather than roles
3. **Keep Private Data Private**: Use Convex internal functions for sensitive operations
4. **Validate at Every Layer**: Don't trust client-side validation alone

## Security Considerations

1. **JWT Validation**: Convex automatically validates Clerk JWTs
2. **Webhook Authentication**: Webhook endpoints verify Clerk signatures
3. **Database Access Control**: All sensitive operations require appropriate authentication
4. **Role Separation**: Clear separation between admin and regular user capabilities
