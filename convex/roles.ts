// convex/roles.ts

import { v } from 'convex/values'
import { internalMutation, query } from './_generated/server'
import { Id } from './_generated/dataModel'

/**
 * Create or update a role from Clerk webhook data
 */
export const upsertFromClerk = internalMutation({
  args: {
    data: v.any(), // Role data from Clerk
    eventType: v.string() // Event type like 'role.created', 'role.updated'
  },
  handler: async (ctx, { data, eventType }) => {
    // Skip if this is a delete event - should be handled by deleteFromClerk
    if (eventType === 'role.deleted' || data.deleted) {
      console.warn(
        'Received delete event in upsertFromClerk - this should be handled by deleteFromClerk'
      )
      return null
    }

    // Check for existing role
    const existingRole = await ctx.db
      .query('roles')
      .withIndex('byExternalId', q => q.eq('externalId', data.id))
      .unique()

    // Process permissions associated with this role (if any)
    let permissionIds: Id<'permissions'>[] = []
    let permissionExternalIds: string[] = []

    if (data.permissions && Array.isArray(data.permissions)) {
      // Map of external permission IDs to internal IDs
      const permissionMap = new Map<string, Id<'permissions'>>()

      // Process each permission
      for (const permissionData of data.permissions) {
        // Store the external ID for reference
        permissionExternalIds.push(permissionData.id)

        // Check if permission exists in our database
        const existingPermission = await ctx.db
          .query('permissions')
          .withIndex('byExternalId', q => q.eq('externalId', permissionData.id))
          .unique()

        if (existingPermission) {
          // If permission exists, use its ID
          permissionIds.push(existingPermission._id)
          permissionMap.set(permissionData.id, existingPermission._id)
        } else {
          // If permission doesn't exist, create it
          const now = new Date().toISOString()

          // Basic permission data from the role's permissions array
          const permissionAttrs = {
            externalId: permissionData.id,
            key: permissionData.key,
            name: permissionData.name,
            description: permissionData.description || undefined,
            type: permissionData.type || 'system',
            createdAt: permissionData.created_at
              ? new Date(permissionData.created_at).toISOString()
              : now,
            updatedAt: permissionData.updated_at
              ? new Date(permissionData.updated_at).toISOString()
              : now
          }

          // Insert the new permission
          const newPermissionId = await ctx.db.insert(
            'permissions',
            permissionAttrs
          )
          permissionIds.push(newPermissionId)
          permissionMap.set(permissionData.id, newPermissionId)
        }
      }
    }

    // Format ISO dates
    const createdAt = data.created_at
      ? new Date(data.created_at).toISOString()
      : new Date().toISOString()
    const updatedAt = data.updated_at
      ? new Date(data.updated_at).toISOString()
      : new Date().toISOString()

    // Create enhanced role data object
    const roleData = {
      // Basic identification
      externalId: data.id,
      key: data.key,

      // Descriptive information
      name: data.name,
      description: data.description || undefined,
      isCreatorEligible: data.is_creator_eligible,

      // Timestamps
      createdAt,
      updatedAt,

      // Permissions
      permissionIds: permissionIds.length > 0 ? permissionIds : undefined,
      permissionExternalIds:
        permissionExternalIds.length > 0 ? permissionExternalIds : undefined,

      // Additional metadata
      publicMetadata:
        data.public_metadata && Object.keys(data.public_metadata).length > 0
          ? data.public_metadata
          : undefined,
      privateMetadata:
        data.private_metadata && Object.keys(data.private_metadata).length > 0
          ? data.private_metadata
          : undefined
    }

    // Ensure required fields are always included
    const requiredFields = {
      externalId: roleData.externalId,
      key: roleData.key,
      name: roleData.name,
      createdAt: roleData.createdAt
    }

    // Filter out undefined values for optional fields
    const optionalFields = Object.fromEntries(
      Object.entries(roleData).filter(
        ([key, v]) =>
          v !== undefined &&
          !['externalId', 'key', 'name', 'createdAt'].includes(key)
      )
    )

    // Combine required and optional fields
    const finalData = { ...requiredFields, ...optionalFields }

    if (existingRole) {
      // Update existing role
      await ctx.db.patch(existingRole._id, finalData)
      return { success: true, roleId: existingRole._id }
    } else {
      // Create new role
      const newRoleId = await ctx.db.insert('roles', finalData)
      return { success: true, roleId: newRoleId }
    }
  }
})

/**
 * Delete a role from Clerk
 */
export const deleteFromClerk = internalMutation({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    const role = await ctx.db
      .query('roles')
      .withIndex('byExternalId', q => q.eq('externalId', id))
      .unique()

    if (!role) {
      console.warn(`Cannot delete role: Role with ID ${id} not found`)
      return { success: false, reason: 'role_not_found' }
    }

    await ctx.db.delete(role._id)
    return { success: true }
  }
})

/**
 * Get all roles
 */
export const getAll = query({
  args: {},
  handler: async ctx => {
    return await ctx.db.query('roles').collect()
  }
})

/**
 * Get role by key
 */
export const getByKey = query({
  args: { key: v.string() },
  handler: async (ctx, { key }) => {
    return await ctx.db
      .query('roles')
      .withIndex('byKey', q => q.eq('key', key))
      .unique()
  }
})

/**
 * Get role by ID
 */
export const getById = query({
  args: { id: v.id('roles') },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id)
  }
})

/**
 * Get a role with its permissions fully populated
 */
export const getWithPermissions = query({
  args: { id: v.id('roles') },
  handler: async (ctx, { id }) => {
    const role = await ctx.db.get(id)
    if (!role) return null

    // If the role has no permission IDs, return just the role
    if (!role.permissionIds || role.permissionIds.length === 0) {
      return { ...role, permissions: [] }
    }

    // Load all associated permissions
    const permissions = await Promise.all(
      role.permissionIds.map(permId => ctx.db.get(permId))
    )

    // Filter out any null permissions (in case of deletion)
    const validPermissions = permissions.filter(p => p !== null)

    return {
      ...role,
      permissions: validPermissions
    }
  }
})
