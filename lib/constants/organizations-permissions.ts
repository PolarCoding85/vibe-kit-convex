/**
 * Default organization permissions in Clerk
 * Based on Clerk's default RBAC system
 */

// Full list of Clerk system permissions
export const defaultPermissions = [
  {
    key: 'org:sys_profile:delete',
    name: 'Delete organization',
    description: 'Permission to delete an organization.',
    type: 'organization'
  },
  {
    key: 'org:sys_billing:manage',
    name: 'Manage billing',
    description: 'Permission to manage the billing information of an organization.',
    type: 'organization'
  },
  {
    key: 'org:sys_domains:manage',
    name: 'Manage domains',
    description: 'Permission to manage the domains of an organization.',
    type: 'organization'
  },
  {
    key: 'org:sys_memberships:manage',
    name: 'Manage members',
    description: 'Permission to manage the members of an organization.',
    type: 'organization'
  },
  {
    key: 'org:sys_profile:manage',
    name: 'Manage organization',
    description: 'Permission to manage an organization.',
    type: 'organization'
  },
  {
    key: 'org:sys_billing:read',
    name: 'Read billing',
    description: 'Permission to read the billing information of an organization.',
    type: 'organization'
  },
  {
    key: 'org:sys_domains:read',
    name: 'Read domains',
    description: 'Permission to read the domains of an organization.',
    type: 'organization'
  },
  {
    key: 'org:sys_memberships:read',
    name: 'Read members',
    description: 'Permission to read the members of an organization.',
    type: 'organization'
  }
]

// Permission groups for easier management
export const permissionGroups = {
  // Organization profile permissions
  profile: {
    manage: 'org:sys_profile:manage',
    delete: 'org:sys_profile:delete'
  },
  // Membership permissions
  memberships: {
    read: 'org:sys_memberships:read',
    manage: 'org:sys_memberships:manage'
  },
  // Domain permissions
  domains: {
    read: 'org:sys_domains:read',
    manage: 'org:sys_domains:manage'
  },
  // Billing permissions
  billing: {
    read: 'org:sys_billing:read',
    manage: 'org:sys_billing:manage'
  }
}

// Helper function to check if a user has a permission
export function hasPermission(userPermissions: string[], requiredPermission: string): boolean {
  return userPermissions.includes(requiredPermission)
}

// Helper function to check if a user has any of the given permissions
export function hasAnyPermission(userPermissions: string[], requiredPermissions: string[]): boolean {
  return requiredPermissions.some(permission => userPermissions.includes(permission))
}

// Helper function to check if a user has all of the given permissions
export function hasAllPermissions(userPermissions: string[], requiredPermissions: string[]): boolean {
  return requiredPermissions.every(permission => userPermissions.includes(permission))
}
