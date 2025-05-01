// convex/util/orgAuth.ts

import { QueryCtx, MutationCtx } from "../_generated/server";
import { ConvexError } from "convex/values";
import { Id } from "../_generated/dataModel";
import { getAuthenticatedUser } from "./auth";

/**
 * Checks if the authenticated user is a member of a specific organization.
 * Throws a ConvexError if the user is not authenticated or not a member of the organization.
 * Returns the membership record if the user is a member.
 */
export async function checkOrganizationMembership(
  ctx: QueryCtx | MutationCtx,
  organizationId: Id<"organizations">
) {
  const user = await getAuthenticatedUser(ctx);
  
  const membership = await ctx.db
    .query("organizationMemberships")
    .withIndex("byUserAndOrganization", (q: any) => 
      q.eq("userId", user._id).eq("organizationId", organizationId)
    )
    .unique();
    
  if (!membership) {
    throw new ConvexError("User is not a member of this organization");
  }
  
  return membership;
}

/**
 * Checks if the authenticated user is an admin of a specific organization.
 * Throws a ConvexError if the user is not authenticated, not a member, or not an admin.
 * Returns the membership record if the user is an admin.
 */
export async function requireOrgAdmin(
  ctx: QueryCtx | MutationCtx,
  organizationId: Id<"organizations">
) {
  const membership = await checkOrganizationMembership(ctx, organizationId);
  
  if (membership.role !== "admin") {
    throw new ConvexError("This action requires admin permissions");
  }
  
  return membership;
}

/**
 * Utility to get all organizations that the current user is a member of.
 * Returns an empty array if the user is not authenticated.
 */
export async function getUserOrganizations(ctx: QueryCtx | MutationCtx) {
  try {
    const user = await getAuthenticatedUser(ctx);
    
    const memberships = await ctx.db
      .query("organizationMemberships")
      .withIndex("byUser", (q: any) => q.eq("userId", user._id))
      .collect();
    
    const organizationIds = memberships.map((m: any) => m.organizationId);
    
    if (organizationIds.length === 0) {
      return [];
    }
    
    // Fetch all the organizations in a single operation
    const organizations = await Promise.all(
      organizationIds.map((id: any) => ctx.db.get(id))
    );
    
    return organizations.filter((org: any) => org !== null);
  } catch (error) {
    // If not authenticated, return empty array
    if (error instanceof ConvexError && error.message.includes("Not authenticated")) {
      return [];
    }
    throw error;
  }
}
