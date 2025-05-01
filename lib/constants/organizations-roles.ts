/**
 * Default organization roles in Clerk
 * Based on Clerk's default RBAC system
 */

// Simple list of available roles for UI dropdowns
export const organizationRoles = [
  { value: 'org:super_admin', label: 'Super Admin' },
  { value: 'org:super_user', label: 'Super User' },
  { value: 'org:admin', label: 'Admin' },
  { value: 'org:member', label: 'Member' }
]

// Detailed role definitions with their permissions
export const defaultRoles = [
  {
    key: 'org:admin',
    name: 'Admin',
    description: 'Role with elevated permissions in the organization.',
    isCreatorEligible: true,
    permissions: [
      'org:sys_profile:manage',
      'org:sys_profile:delete',
      'org:sys_memberships:read',
      'org:sys_memberships:manage',
      'org:sys_domains:read',
      'org:sys_domains:manage'
    ]
  },
  {
    key: 'org:member',
    name: 'Member',
    description: 'Role with non-privileged permissions in the organization.',
    permissions: ['org:sys_memberships:read']
  }
]
