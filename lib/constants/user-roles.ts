/**
 * Constants and helpers for user roles in the application
 * Defines system-wide roles that exist outside of organizations
 */

import type { Doc } from '../../convex/_generated/dataModel'

// System-wide role types
export enum SystemRoleType {
  SuperAdmin = 'super_admin',
  SuperUser = 'super_user',
  User = 'user' // Regular user with no special system privileges
}

// Helper functions to check user roles

/**
 * Check if a user has super admin privileges
 * @param user User document from database
 * @returns boolean indicating if user is a super admin
 */
export function isSuperAdmin(user: Doc<'users'> | null): boolean {
  if (!user) return false
  return user.isSuperAdmin === true
}

/**
 * Check if a user has super user privileges
 * @param user User document from database
 * @returns boolean indicating if user is a super user
 */
export function isSuperUser(user: Doc<'users'> | null): boolean {
  if (!user) return false
  return user.isSuperUser === true
}

/**
 * Check if a user has any system-wide admin privileges (either super admin or super user)
 * @param user User document from database
 * @returns boolean indicating if user has admin privileges
 */
export function hasSystemAdminAccess(user: Doc<'users'> | null): boolean {
  if (!user) return false
  return isSuperAdmin(user) || isSuperUser(user)
}

/**
 * Get the highest system role for a user
 * @param user User document from database
 * @returns The highest system role the user has
 */
export function getSystemRole(user: Doc<'users'> | null): SystemRoleType {
  if (!user) return SystemRoleType.User
  if (isSuperAdmin(user)) return SystemRoleType.SuperAdmin
  if (isSuperUser(user)) return SystemRoleType.SuperUser
  return SystemRoleType.User
}

/**
 * Get displayable name for a system role
 * @param role The system role type
 * @returns Human-readable role name
 */
export function getSystemRoleName(role: SystemRoleType): string {
  switch (role) {
    case SystemRoleType.SuperAdmin:
      return 'Super Administrator'
    case SystemRoleType.SuperUser:
      return 'Super User'
    case SystemRoleType.User:
      return 'Regular User'
    default:
      return 'Unknown Role'
  }
}
