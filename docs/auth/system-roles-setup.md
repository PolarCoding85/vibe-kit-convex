# System Roles Setup Guide

This guide explains how to set up and manage system-wide admin roles that exist outside of the organization structure.

## Understanding System Roles

Our application supports two system-wide roles that provide elevated privileges across the entire platform:

1. **SuperAdmin**: The highest privilege level with full access to all system features and administration capabilities.
2. **SuperUser**: An elevated privilege level with access to advanced features but not full administrative capabilities.

These roles are independent of the organization structure and grant privileges at the application level rather than within specific organizations.

## Setting Up the First SuperAdmin

Since the system requires a SuperAdmin to manage other SuperAdmins, you'll need to set up the first one manually. Here are the available methods:

### Method 1: Using Clerk Dashboard (Recommended)

1. Log in to your [Clerk Dashboard](https://dashboard.clerk.dev)
2. Navigate to "Users" and find the user you want to make a SuperAdmin
3. Click on the user to view their details
4. Go to the "Metadata" tab
5. Add the following to the "Private metadata" section:

```json
{
  "isSuperAdmin": true
}
```

6. Save the changes
7. The user will become a SuperAdmin after they log in again or their session refreshes

### Method 2: Using Convex Dashboard

If you have access to the Convex Dashboard:

1. Navigate to your Convex project dashboard
2. Go to "Data" and select the "users" table
3. Find the user you want to make a SuperAdmin
4. Edit their record and set `isSuperAdmin` to `true`
5. Save the changes

### Method 3: Using Convex CLI

For developers with Convex CLI access:

```bash
npx convex run users:setSuperAdmin --externalId="<clerk_user_id>" --isSuperAdmin=true
```

Replace `<clerk_user_id>` with the Clerk ID of the user (found in the Clerk Dashboard).

## Managing System Roles

Once you have at least one SuperAdmin, you can manage system roles through:

1. **Admin Portal**: SuperAdmins can access the admin portal and assign/revoke system roles to other users.

2. **API**: You can use the `updateUserSystemRole` mutation:

```typescript
// Example: Promote a user to SuperUser
await convex.mutation('admin:updateUserSystemRole', {
  userId: 'convex_user_id',
  isSuperUser: true
});

// Example: Revoke SuperAdmin privileges
await convex.mutation('admin:updateUserSystemRole', {
  userId: 'convex_user_id',
  isSuperAdmin: false
});
```

## Security Considerations

- **Only SuperAdmins** can grant or revoke system roles
- A user cannot be both a SuperAdmin and SuperUser simultaneously (SuperAdmin takes precedence)
- System roles are stored in both Convex and synced to Clerk's private metadata
- Consider implementing MFA for all SuperAdmin accounts

## Implementation Details

System roles are implemented using:

1. Boolean flags in the user record: `isSuperAdmin` and `isSuperUser`
2. Helper functions in `lib/constants/user-roles.ts`
3. Two-way sync with Clerk's metadata
4. Protected mutations in `convex/admin/updateUserSystemRole.ts`

## Troubleshooting

If a user's system role isn't being recognized:

1. Check that the user record in Convex has the correct boolean flags set
2. Verify the Clerk private metadata contains the corresponding flags
3. Have the user log out and log back in
4. Check for any errors in the Convex logs related to role updates
