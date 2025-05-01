// convex/permissions.ts

import { v } from 'convex/values'
import { internalMutation, query } from './_generated/server'
import { Id } from './_generated/dataModel'

/**
 * Create or update a permission from Clerk webhook data
 */
export const upsertFromClerk = internalMutation({
  args: {
    data: v.any(), // Permission data from Clerk
    eventType: v.string() // Event type like 'permission.created', 'permission.updated'
  },
  handler: async (ctx, { data, eventType }) => {
    // Skip if this is a delete event - should be handled by deleteFromClerk
    if (eventType === 'permission.deleted' || data.deleted) {
      console.warn(
        'Received delete event in upsertFromClerk - this should be handled by deleteFromClerk'
      )
      return null
    }

    // Check for existing permission
    const existingPermission = await ctx.db
      .query('permissions')
      .withIndex('byExternalId', q => q.eq('externalId', data.id))
      .unique()

    // Format ISO dates
    const createdAt = data.created_at
      ? new Date(data.created_at).toISOString()
      : new Date().toISOString()
    const updatedAt = data.updated_at
      ? new Date(data.updated_at).toISOString()
      : new Date().toISOString()

    // Create enhanced permission data object
    const permissionData = {
      // Basic identification
      externalId: data.id,
      key: data.key,

      // Descriptive information
      name: data.name,
      description: data.description || undefined,
      type: data.type,

      // Timestamps
      createdAt,
      updatedAt,

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
      externalId: permissionData.externalId,
      key: permissionData.key,
      name: permissionData.name,
      type: permissionData.type,
      createdAt: permissionData.createdAt
    }

    // Filter out undefined values for optional fields
    const optionalFields = Object.fromEntries(
      Object.entries(permissionData).filter(
        ([key, v]) =>
          v !== undefined &&
          !['externalId', 'key', 'name', 'type', 'createdAt'].includes(key)
      )
    )

    // Combine required and optional fields
    const finalData = { ...requiredFields, ...optionalFields }

    if (existingPermission) {
      // Update existing permission
      await ctx.db.patch(existingPermission._id, finalData)
      return { success: true, permissionId: existingPermission._id }
    } else {
      // Create new permission
      const newPermissionId = await ctx.db.insert('permissions', finalData)
      return { success: true, permissionId: newPermissionId }
    }
  }
})

/**
 * Delete a permission from Clerk
 */
export const deleteFromClerk = internalMutation({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    const permission = await ctx.db
      .query('permissions')
      .withIndex('byExternalId', q => q.eq('externalId', id))
      .unique()

    if (!permission) {
      console.warn(
        `Cannot delete permission: Permission with ID ${id} not found`
      )
      return { success: false, reason: 'permission_not_found' }
    }

    await ctx.db.delete(permission._id)
    return { success: true }
  }
})

/**
 * Get all permissions
 */
export const getAll = query({
  args: {},
  handler: async ctx => {
    return await ctx.db.query('permissions').collect()
  }
})

/**
 * Get permission by key
 */
export const getByKey = query({
  args: { key: v.string() },
  handler: async (ctx, { key }) => {
    return await ctx.db
      .query('permissions')
      .withIndex('byKey', q => q.eq('key', key))
      .unique()
  }
})

/**
 * Get permission by ID
 */
export const getById = query({
  args: { id: v.id('permissions') },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id)
  }
})
