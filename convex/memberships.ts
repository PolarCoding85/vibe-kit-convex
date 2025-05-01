// convex/memberships.ts

import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { authQuery } from "./util/customFunctions";

/**
 * Get memberships for a specific organization
 */
export const byOrganization = authQuery({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, { organizationId }) => {
    return await ctx.db
      .query("organizationMemberships")
      .withIndex("byOrganization", (q) => q.eq("organizationId", organizationId))
      .collect();
  }
});

/**
 * Get memberships for the authenticated user
 */
export const forCurrentUser = authQuery({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!user) return [];

    return await ctx.db
      .query("organizationMemberships")
      .withIndex("byUser", (q) => q.eq("userId", user._id))
      .collect();
  }
});

/**
 * Create or update a membership from Clerk data
 */
export const upsertFromClerk = internalMutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => {
    // First, find the user
    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", data.public_user_data.user_id))
      .unique();

    if (!user) {
      console.warn(`Cannot create membership: User ${data.public_user_data.user_id} not found`);
      return;
    }

    // Then, find the organization
    const organization = await ctx.db
      .query("organizations")
      .withIndex("byExternalId", (q) => q.eq("externalId", data.organization.id))
      .unique();

    if (!organization) {
      console.warn(`Cannot create membership: Organization ${data.organization.id} not found`);
      return;
    }

    // Check if membership already exists
    const existingMembership = await ctx.db
      .query("organizationMemberships")
      .withIndex("byUserAndOrganization", (q) =>
        q.eq("userId", user._id).eq("organizationId", organization._id)
      )
      .unique();

    const membershipData = {
      userId: user._id,
      organizationId: organization._id,
      role: data.role
    };

    if (existingMembership) {
      // Update existing membership
      return await ctx.db.patch(existingMembership._id, membershipData);
    } else {
      // Create new membership
      return await ctx.db.insert("organizationMemberships", membershipData);
    }
  }
});

/**
 * Delete a membership from Clerk data
 */
export const deleteFromClerk = internalMutation({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    // First, find the membership using the Clerk membership ID
    // We don't store the Clerk membership ID in our database, so we'll need to find it
    // by matching properties between our database and Clerk's data structure

    // Attempt to parse the ID to extract information
    // Clerk membership IDs might follow patterns like org_id:user_id, but this could vary
    // The implementation depends on how Clerk structures its membership IDs
    
    // For now, log a warning and leave this as a placeholder
    console.warn(`Delete membership request received for ID: ${id}`);
    console.warn("This function needs implementation based on Clerk's membership ID structure");
    
    // Once we can reliably identify the membership to delete, uncomment this code:
    /*
    if (membership) {
      await ctx.db.delete(membership._id);
      return { success: true };
    } else {
      console.warn(`Membership with ID ${id} not found`);
      return { success: false, reason: 'not_found' };
    }
    */
  }
});

/**
 * Admin function to add a user to an organization with a specific role
 */
export const addMember = internalMutation({
  args: {
    userId: v.id("users"),
    organizationId: v.id("organizations"),
    role: v.string()
  },
  handler: async (ctx, { userId, organizationId, role }) => {
    // Check if membership already exists
    const existing = await ctx.db
      .query("organizationMemberships")
      .withIndex("byUserAndOrganization", (q) =>
        q.eq("userId", userId).eq("organizationId", organizationId)
      )
      .unique();

    if (existing) {
      // Update role if membership exists
      return await ctx.db.patch(existing._id, { role });
    } else {
      // Create new membership
      return await ctx.db.insert("organizationMemberships", {
        userId,
        organizationId,
        role
      });
    }
  }
});

/**
 * Admin function to remove a user from an organization
 */
export const removeMember = internalMutation({
  args: {
    userId: v.id("users"),
    organizationId: v.id("organizations")
  },
  handler: async (ctx, { userId, organizationId }) => {
    const membership = await ctx.db
      .query("organizationMemberships")
      .withIndex("byUserAndOrganization", (q) =>
        q.eq("userId", userId).eq("organizationId", organizationId)
      )
      .unique();

    if (membership) {
      await ctx.db.delete(membership._id);
      return { success: true };
    } else {
      return { success: false, reason: "membership_not_found" };
    }
  }
});
